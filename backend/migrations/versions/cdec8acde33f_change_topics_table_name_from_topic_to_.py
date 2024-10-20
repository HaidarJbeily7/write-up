"""Change topics table name from 'topic' to 'topics'

Revision ID: cdec8acde33f
Revises: 17b19ad637f5
Create Date: 2024-10-20 16:43:50.145889

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'cdec8acde33f'
down_revision = '17b19ad637f5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('topics',
    sa.Column('id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('question', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('category', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('exam_type', sa.Enum('TOEFL', 'IELTS', name='examtype'), nullable=False),
    sa.Column('difficulty_level', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_topics_category'), 'topics', ['category'], unique=False)
    op.create_index(op.f('ix_topics_id'), 'topics', ['id'], unique=False)
    op.create_index(op.f('ix_topics_question'), 'topics', ['question'], unique=False)
    op.drop_index('ix_topic_category', table_name='topic')
    op.drop_index('ix_topic_id', table_name='topic')
    op.drop_index('ix_topic_question', table_name='topic')
    op.drop_table('topic')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('topic',
    sa.Column('id', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('question', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('category', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('exam_type', mysql.ENUM('TOEFL', 'IELTS'), nullable=False),
    sa.Column('difficulty_level', mysql.INTEGER(display_width=11), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_unicode_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('ix_topic_question', 'topic', ['question'], unique=False)
    op.create_index('ix_topic_id', 'topic', ['id'], unique=False)
    op.create_index('ix_topic_category', 'topic', ['category'], unique=False)
    op.drop_index(op.f('ix_topics_question'), table_name='topics')
    op.drop_index(op.f('ix_topics_id'), table_name='topics')
    op.drop_index(op.f('ix_topics_category'), table_name='topics')
    op.drop_table('topics')
    # ### end Alembic commands ###
