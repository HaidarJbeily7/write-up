from csv import DictReader
from sqlmodel import Session, select
from .models import Topic, ExamType
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

        for i, row in df.iterrows():
            topic_id = f"ielts-task1-topic-{i}"
            topic = Topic(
                id=topic_id,
                question=row['question'],
                category=row['category'],
                exam_type=ExamType.IELTS,
                difficulty_level=row.get("difficulty_level")
            )
            topics.append(topic)

    with Session(db_engine) as session:
        existing_topics = session.exec(select(Topic.id)).all()
        new_topics = [
            topic for topic in topics if topic.id not in existing_topics]
        session.add_all(new_topics)
        session.commit()

    print(f"Added {len(new_topics)} new topics to the database.")


def initialize_topics():
    with Session(db_engine) as session:
        if session.exec(select(Topic)).first() is None:
            load_ielts_topics()
        else:
            print("Topics already exist in the database. Skipping initialization.")
