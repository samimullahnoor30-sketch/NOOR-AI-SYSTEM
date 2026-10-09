"""Add customer and project foreign keys."""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "19e6c0184607"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add missing customer indexes.
    op.create_index(
        "ix_customers_created_at",
        "customers",
        ["created_at"],
        unique=False,
    )
    op.create_index(
        "ix_customers_email",
        "customers",
        ["email"],
        unique=False,
    )
    op.create_index(
        "ix_customers_full_name",
        "customers",
        ["full_name"],
        unique=False,
    )
    op.create_index(
        "ix_customers_is_active",
        "customers",
        ["is_active"],
        unique=False,
    )

    # Add foreign keys safely using SQLite batch table recreation.
    with op.batch_alter_table("projects", recreate="always") as batch_op:
        batch_op.create_foreign_key(
            "fk_projects_customer_id_customers",
            "customers",
            ["customer_id"],
            ["id"],
        )

    with op.batch_alter_table("documents", recreate="always") as batch_op:
        batch_op.create_foreign_key(
            "fk_documents_customer_id_customers",
            "customers",
            ["customer_id"],
            ["id"],
        )
        batch_op.create_foreign_key(
            "fk_documents_project_id_projects",
            "projects",
            ["project_id"],
            ["id"],
        )


def downgrade() -> None:
    # Remove foreign keys using SQLite batch table recreation.
    with op.batch_alter_table("documents", recreate="always") as batch_op:
        batch_op.drop_constraint(
            "fk_documents_project_id_projects",
            type_="foreignkey",
        )
        batch_op.drop_constraint(
            "fk_documents_customer_id_customers",
            type_="foreignkey",
        )

    with op.batch_alter_table("projects", recreate="always") as batch_op:
        batch_op.drop_constraint(
            "fk_projects_customer_id_customers",
            type_="foreignkey",
        )

    op.drop_index("ix_customers_is_active", table_name="customers")
    op.drop_index("ix_customers_full_name", table_name="customers")
    op.drop_index("ix_customers_email", table_name="customers")
    op.drop_index("ix_customers_created_at", table_name="customers")
    