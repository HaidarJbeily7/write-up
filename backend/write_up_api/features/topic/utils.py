import json
from sqlmodel import Session, select

from .queries import get_topic_from_submission

from .prompts import IELTS_TASK_1_EVALUATION_PROMPT
from .models import SubmissionEvaluation, Topic, ExamType, TopicSubmission
from ...common.db_engine import db_engine
from typing import List


def load_ielts_task1_topics():
    topics: List[Topic] = []
    with open("./data/ielts-task1-topics.csv", "r") as file:
        import pandas as pd
        df: pd.DataFrame = pd.read_csv(file)
        # Remove rows with any missing values
        df = df.dropna()
        # Remove empty rows
        df = df[df.astype(bool).sum(axis=1) > 0]

        for _, row in df.iterrows():
            topic = Topic(
                question=row['question'],
                category=row['category'],
                exam_type=ExamType.IELTS,
                difficulty_level=row.get("difficulty_level"),
                topic_metadata={
                    "task_type": "Task 1"
                }
            )
            topics.append(topic)

    with Session(db_engine) as session:
        existing_topics = session.exec(select(Topic.question)).all()
        new_topics = [
            topic for topic in topics if topic.question not in existing_topics]
        session.add_all(new_topics)
        session.commit()

    print(f"Added {len(new_topics)} new topics to the database.")


def initialize_topics():
    try:
        with Session(db_engine) as session:
            if session.exec(select(Topic)).first() is None:
                load_ielts_task1_topics()
            else:
                print("Topics already exist in the database. Skipping initialization.")
    except Exception as e:
        print(f"Error initializing topics: {e}")

def evaluate_submission(submission: TopicSubmission) -> str:
    try:
        from dotenv import load_dotenv
        from julep import Julep
        from ...common.config import settings


        topic = get_topic_from_submission(submission)

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
                        "content": IELTS_TASK_1_EVALUATION_PROMPT
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
            
            json_part = message.split("```json")[1].split("```")[0]

            return SubmissionEvaluation(**json.loads(json_part))
        
        except Exception as e:
            raise RuntimeError(f"Failed to get chat response: {str(e)}")
        

    except Exception as e:
        # Log the error for debugging
        print(f"Error in evaluate_submission: {str(e)}")
        # Return a user-friendly error message
        raise e
