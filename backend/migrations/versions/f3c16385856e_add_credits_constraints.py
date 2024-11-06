"""Add credits constraints

Revision ID: f3c16385856e
Revises: c8fe784c27b1
Create Date: 2024-11-06 21:06:44.025143

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = 'f3c16385856e'
down_revision = 'c8fe784c27b1'
branch_labels = None
depends_on = None


def upgrade():
    op.create_check_constraint(
        'check_credits_spent',
        'user_credits',
        'credits_spent <= credits_allowance'
    )


def downgrade():
    op.drop_constraint('check_credits_spent', 'user_credits')
