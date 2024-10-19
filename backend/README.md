# Backend for Write-Up

This directory contains the backend code for the Write-Up project.

## Technology Stack

- Python 3.8+
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Alembic for database migrations
- pytest for unit and integration testing

## Project Structure

## How to Run the Project

1. Ensure you have Python 3.8+ installed on your system.

2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Install project dependencies:
   ```
   poetry install
   ```

4. Activate the virtual environment:
   ```
   poetry shell
   ```

5. Run the FastAPI server:
   ```
   fastapi dev write_up_api.web
   ```

## Database Migrations

To manage database schema changes, we use Alembic for migrations. Follow these steps to create and apply migrations:

1. Create a new migration:
   ```
   python -m alembic revision --autogenerate -m "Your migration message/description"
   ```

   Replace "Your migration message/description" with a brief description of the changes in your migration.

2. Run the migration:
   ```
   python -m alembic upgrade head
   ```

   This command will apply all pending migrations to your database.


## Adding New Models

When adding new models to the project, follow these steps to ensure they are properly integrated with the database migration system:

1. Create your new model in the appropriate file within the `write_up_api/features` directory.

2. After creating the new model, you need to add a reference to it in the `migrations/env.py` file. This step is crucial for Alembic to detect and include the new model in migrations.

3. Open `migrations/env.py` and locate the section where models are imported. Add an import statement for your new model. For example:

   ```python
   from write_up_api.features.your_feature.models import YourNewModel
   ```

4. In the same file, find the `target_metadata` variable and ensure your new model's metadata is included. It should look something like this:

   ```python
   target_metadata = SQLModel.metadata
   ```

   If you're using a different base for your models, make sure it's properly referenced here.

5. After adding the reference, proceed with creating and running the migration as described in the "Database Migrations" section above.

By following these steps, you ensure that Alembic will properly detect and manage changes to your new model in future migrations.

