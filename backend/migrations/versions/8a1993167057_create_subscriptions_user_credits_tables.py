"""create subscriptions/user_credits tables

Revision ID: 8a1993167057
Revises: 8383e9ee8956
Create Date: 2024-10-31 13:59:49.499078

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '8a1993167057'
down_revision = '8383e9ee8956'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('subscriptions',
    sa.Column('id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('user_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('plan', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('stripe_payment_intent_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('stripe_customer_id', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    sa.Column('amount_paid', sa.Integer(), nullable=False),
    sa.Column('status', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_credits',
    sa.Column('id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('user_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('credits_allowance', sa.Integer(), nullable=False),
    sa.Column('credits_spent', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_credits')
    op.drop_table('subscriptions')
    # ### end Alembic commands ###