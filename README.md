# Store Rating System

A comprehensive store rating system with role-based access control.

## Features
- User roles: Admin, Store Owner, and Normal User
- Store management and ratings
- User management
- Dashboard with statistics

## Local Development Setup

### Prerequisites
- Node.js v20 or later
- PostgreSQL installed locally (via PgAdmin or standalone installation)

### Database Setup
1. Install PostgreSQL if you haven't already:
   - Download and install PostgreSQL from https://www.postgresql.org/download/
   - Install PgAdmin if you want a GUI to manage your database

2. Create a new database:
   - Using psql:
     ```sql
     CREATE DATABASE store_ratings;
     ```
   - Or using PgAdmin:
     1. Right-click on "Databases"
     2. Select "Create" > "Database"
     3. Name it "store_ratings"
     4. Click "Save"

### Project Setup
1. Clone the repository
2. Copy the environment file:
```bash
cp .env.example .env
```
3. Update the `.env` file with your PostgreSQL credentials:
   - Set `DATABASE_URL` to point to your local database:
     ```
     DATABASE_URL=postgresql://postgres:your_password@localhost:5432/store_ratings
     ```
   - Update other PG* variables:
     - `PGHOST`: Usually "localhost"
     - `PGDATABASE`: "store_ratings"
     - `PGUSER`: Usually "postgres"
     - `PGPORT`: Usually 5432
     - `PGPASSWORD`: Your PostgreSQL password
   - Set `SESSION_SECRET` to a secure random string

4. Install dependencies:
```bash
npm install
```

5. Push the database schema:
```bash
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5000

## User Registration
- To create an admin user, register with role set to "admin"
- For store owners, use role "store_owner"
- Regular users will have role "user" by default

## API Routes
- `/api/register` - Register new user
- `/api/login` - User login
- `/api/logout` - User logout
- `/api/stores` - Store management
- `/api/users` - User management (admin only)

## Troubleshooting

### Database Connection Issues
1. Check that PostgreSQL is running locally
2. Verify your database credentials in `.env`
3. Make sure the database exists
4. Try connecting using psql or PgAdmin with the same credentials

### Authentication Issues
1. Verify your SESSION_SECRET is set in `.env`
2. Clear your browser cookies and try logging in again
3. Check that all fields meet the validation requirements:
   - Name: 20-60 characters
   - Password: 8-16 characters, must include uppercase and special character
   - Email: Must be valid format
   - Address: Max 400 characters