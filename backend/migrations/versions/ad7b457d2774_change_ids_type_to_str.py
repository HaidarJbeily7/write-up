"""Change ids type to str

Revision ID: ad7b457d2774
Revises: af2d6a890b70
Create Date: 2024-10-27 14:28:17.916148

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'ad7b457d2774'
down_revision = 'af2d6a890b70'
branch_labels = None
depends_on = None


def upgrade():
    # Drop foreign key constraints
    op.drop_constraint('topic_submissions_ibfk_1',
                       'topic_submissions', type_='foreignkey')
    op.drop_constraint('topic_submissions_ibfk_2',
                       'topic_submissions', type_='foreignkey')

    # Alter columns
    op.alter_column('topics', 'id',
                    existing_type=mysql.CHAR(length=32),
                    type_=sqlmodel.sql.sqltypes.AutoString(),
                    existing_nullable=False)

    op.alter_column('topic_submissions', 'id',
                    existing_type=mysql.CHAR(length=32),
                    type_=sqlmodel.sql.sqltypes.AutoString(),
                    existing_nullable=False)
    op.alter_column('topic_submissions', 'user_id',
                    existing_type=mysql.CHAR(length=32),
                    type_=sqlmodel.sql.sqltypes.AutoString(),
                    existing_nullable=False)
    op.alter_column('topic_submissions', 'topic_id',
                    existing_type=mysql.CHAR(length=32),
                    type_=sqlmodel.sql.sqltypes.AutoString(),
                    existing_nullable=False)

    # Recreate foreign key constraints
    op.create_foreign_key('topic_submissions_ibfk_1',
                          'topic_submissions', 'topics', ['topic_id'], ['id'])
    op.create_foreign_key('topic_submissions_ibfk_2',
                          'topic_submissions', 'users', ['user_id'], ['id'])


def downgrade():
    # Drop foreign key constraints
    op.drop_constraint('topic_submissions_ibfk_1',
                       'topic_submissions', type_='foreignkey')
    op.drop_constraint('topic_submissions_ibfk_2',
                       'topic_submissions', type_='foreignkey')

    # Alter columns back
    op.alter_column('topics', 'id',
                    existing_type=sqlmodel.sql.sqltypes.AutoString(),
                    type_=mysql.CHAR(length=32),
                    existing_nullable=False)
    op.alter_column('topic_submissions', 'topic_id',
                    existing_type=sqlmodel.sql.sqltypes.AutoString(),
                    type_=mysql.CHAR(length=32),
                    existing_nullable=False)
    op.alter_column('topic_submissions', 'user_id',
                    existing_type=sqlmodel.sql.sqltypes.AutoString(),
                    type_=mysql.CHAR(length=32),
                    existing_nullable=False)
    op.alter_column('topic_submissions', 'id',
                    existing_type=sqlmodel.sql.sqltypes.AutoString(),
                    type_=mysql.CHAR(length=32),
                    existing_nullable=False)

    # Recreate foreign key constraints
    op.create_foreign_key('topic_submissions_ibfk_1',
                          'topic_submissions', 'topics', ['topic_id'], ['id'])
    op.create_foreign_key('topic_submissions_ibfk_2',
                          'topic_submissions', 'users', ['user_id'], ['id'])
