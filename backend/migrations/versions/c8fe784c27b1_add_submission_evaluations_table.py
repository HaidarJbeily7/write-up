"""Add submission_evaluations table

Revision ID: c8fe784c27b1
Revises: e05305c82d17
Create Date: 2024-11-03 23:17:08.344680

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = 'c8fe784c27b1'
down_revision = 'e05305c82d17'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('submission_evaluations',
    sa.Column('id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('submission_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('task_achievement', sa.JSON(), nullable=True),
    sa.Column('coherence_and_cohesion', sa.JSON(), nullable=True),
    sa.Column('lexical_resource', sa.JSON(), nullable=True),
    sa.Column('grammatical_range_and_accuracy', sa.JSON(), nullable=True),
    sa.Column('overall', sa.JSON(), nullable=True),
    sa.ForeignKeyConstraint(['submission_id'], ['topic_submissions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_submission_evaluations_id'), 'submission_evaluations', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_submission_evaluations_id'), table_name='submission_evaluations')
    op.drop_table('submission_evaluations')
    # ### end Alembic commands ###
