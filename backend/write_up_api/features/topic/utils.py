import json
import logging
from sqlmodel import Session, select

from .queries import add_new_topics, get_filtered_topics, get_topic_from_submission

from .prompts import IELTS_TASK_1_EVALUATION_PROMPT, IELTS_TASK_2_EVALUATION_PROMPT
from .models import SubmissionEvaluation, Topic, ExamType, TopicSubmission
from ...common.db_engine import db_engine
from typing import List
from fastapi_pagination import Params

logger = logging.getLogger(__name__)


# -------------------------------------------------------------------------------------------------
# Topic Initialization
# -------------------------------------------------------------------------------------------------

def get_topic_file_path(exam_type: ExamType, task_type: str) -> str:
    return f"./data/{exam_type.value.lower()}-{''.join(task_type.lower().split())}-topics.csv"


def get_topics_from_file(exam_type: ExamType, task_type: str) -> List[Topic]:
    topics: List[Topic] = []
    file_path = get_topic_file_path(exam_type, task_type)

    try:
        import pandas as pd

        df: pd.DataFrame = pd.read_csv(file_path)
        # Remove rows with any missing values
        df = df.dropna()
        # Remove empty rows
        df = df[df.astype(bool).sum(axis=1) > 0]

        for _, row in df.iterrows():
            topic = Topic(
                question=row['question'],
                category=row['category'],
                exam_type=exam_type,
                difficulty_level=row.get("difficulty_level"),
                topic_metadata={
                    "task_type": task_type
                }
            )
            topics.append(topic)

    except FileNotFoundError:
        logger.error(f"Topics file not found for {exam_type.value} {task_type}, tried path: {file_path}, skipping...")
        return []
        # TODO: Once we have files for all exams, we should raise an error here
    except pd.errors.EmptyDataError:
        logger.error(f"Topics file is empty for {exam_type.value} {task_type}, tried path: {file_path}, skipping...")
        raise
    except Exception as e:
        logger.error(f"Error reading topics file {file_path}: {e}")
        raise

    return topics


def add_new_topics_to_db(exam_type: ExamType, task_type: str) -> int:
    file_topics: List[Topic] = get_topics_from_file(exam_type, task_type)

    existing_topics: List[Topic] = get_filtered_topics(
        exam_type=exam_type, task_type=task_type, paginate=False)

    new_topics = [
        file_topic for file_topic in file_topics 
        if file_topic.question not in [existing_topic.question for existing_topic in existing_topics]
    ]

    if len(new_topics) > 0:
        add_new_topics(new_topics)
        logger.info(f"Added {len(new_topics)} new topics to the database for {exam_type.value} {task_type}.")
        return len(new_topics)
    else:
        logger.info(f"No new topics to add to the database for {exam_type.value} {task_type}.")
        return 0

def initialize_topics():
    try:
        total_added_topics = 0
        for exam_type, task_type in [
            # TODO: Uncomment when we have files for these tasks
            # (ExamType.IELTS, "Task 1"),
            (ExamType.IELTS, "Task 2"),
            # (ExamType.TOEFL, "Task 1"),
            # (ExamType.TOEFL, "Task 2")
        ]:
            n_added_topics = add_new_topics_to_db(exam_type, task_type)
            total_added_topics += n_added_topics
        
        if total_added_topics == 0:
            logger.info("Topics already exist in the database. Skipping initialization.")
        else:
            logger.info(f"Total topics added: {total_added_topics}")
    except Exception as e:
        logger.error(f"Error initializing topics: {e}")

# -------------------------------------------------------------------------------------------------
# Submission Evaluation
# -------------------------------------------------------------------------------------------------

def evaluate_submission(submission: TopicSubmission) -> SubmissionEvaluation:
    try:
        from dotenv import load_dotenv
        from julep import Julep
        from ...common.config import settings

        topic = get_topic_from_submission(submission)

        match topic.exam_type, topic.topic_metadata.get("task_type"):
            case ExamType.IELTS, "Task 1":
                evaluation_prompt = IELTS_TASK_1_EVALUATION_PROMPT
            case ExamType.IELTS, "Task 2":
                evaluation_prompt = IELTS_TASK_2_EVALUATION_PROMPT
            case _:
                raise ValueError(f"Unsupported exam type or task type: {topic.exam_type.value} {topic.topic_metadata.get('task_type')}")

        load_dotenv(override=True)
        
        julep_api_key = settings.JULEP_API_KEY
        if not julep_api_key:
            raise ValueError("JULEP_API_KEY environment variable not set")
            
        openai_api_key = settings.OPENAI_API_KEY
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")

        julep = Julep(api_key=julep_api_key, environment="dev")
        
        try:
            agent = julep.agents.create(
                name="Steve",
                about="a helpful assistant that evaluates IELTS Tasks",
                model="gpt-4o-mini",
            )
        except Exception as e:
            raise RuntimeError(f"Failed to create Julep agent: {str(e)}")

        try:
            session = julep.sessions.create(
                agent=agent.id,
            )
        except Exception as e:
            raise RuntimeError(f"Failed to create Julep session: {str(e)}")
        
        try:
            response = julep.sessions.chat(
                session_id=session.id,
                x_custom_api_key=openai_api_key,
                messages=[
                    {
                        "role": "system",
                        "content": evaluation_prompt
                    },
                    {
                        "role": "user",
                        "content": f"This is the question:\n{topic.question}"
                    },
                    {
                        "role": "user",
                        "content": f"This is the answer:\n{submission.answer}"
                    }
                ]
            )

            message = response.choices[0].message.content
            
            try:
                json_part = message.split("```json")[1].split("```")[0]
                evaluation_data = json.loads(json_part)
                return SubmissionEvaluation(**evaluation_data)

            except IndexError as e:
                raise RuntimeError("Failed to extract JSON from message: Response format was incorrect") from e
            except json.JSONDecodeError as e:
                raise RuntimeError("Failed to parse JSON from response") from e
        
        except Exception as e:
            raise RuntimeError(f"Failed to get chat response: {str(e)}")
        

    except Exception as e:
        logger.error(f"Error in evaluate_submission: {str(e)}")
        raise e
