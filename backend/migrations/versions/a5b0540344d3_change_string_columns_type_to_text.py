"""Change string columns type to Text

Revision ID: a5b0540344d3
Revises: 3326dd722f2e
Create Date: 2024-11-14 23:38:19.792674

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'a5b0540344d3'
down_revision = '3326dd722f2e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('submission_evaluations_v2', 'evaluation',
               existing_type=mysql.VARCHAR(length=255),
               type_=sa.Text(),
               existing_nullable=True)
    op.alter_column('topic_submissions', 'answer',
               existing_type=mysql.VARCHAR(length=255),
               type_=sa.Text(),
               existing_nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('topic_submissions', 'answer',
               existing_type=sa.Text(),
               type_=mysql.VARCHAR(length=255),
               existing_nullable=False)
    op.alter_column('submission_evaluations_v2', 'evaluation',
               existing_type=sa.Text(),
               type_=mysql.VARCHAR(length=255),
               existing_nullable=True)
    # ### end Alembic commands ###
