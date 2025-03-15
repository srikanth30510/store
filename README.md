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
- A Neon database (Create one at https://neon.tech)

### Database Setup
1. Create a new project on Neon.tech:
   - Go to https://neon.tech and sign up/login
   - Click "Create New Project"
   - Give your project a name
   - Select a region close to you
   - Click "Create Project"

2. Get your connection credentials:
   - In your Neon project dashboard, click on "Connection Details"
   - Select "Nodejs" from the "Connection Type" dropdown
   - Copy the connection string that looks like: `postgres://username:password@endpoint/dbname?sslmode=require`
   - Also note down the individual connection parameters (host, database, user, password)

### Project Setup
1. Clone the repository
2. Copy the environment file:
```bash
cp .env.example .env
```
3. Update the `.env` file with your Neon credentials:
   - Set `DATABASE_URL` to your full Neon connection string
   - Fill in the other PG* variables from your Neon dashboard:
     - `PGHOST`: Your Neon host (ends with .aws.neon.tech)
     - `PGDATABASE`: Your database name
     - `PGUSER`: Your database username
     - `PGPORT`: Usually 5432
     - `PGPASSWORD`: Your database password
   - Set `SESSION_SECRET` to a secure random string (e.g., a UUID or a long random string)

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
1. Make sure your Neon project is active (green status in dashboard)
2. Verify all database credentials in your `.env` file
3. Check that sslmode=require is included in your DATABASE_URL
4. If using branching, ensure you're connecting to the main branch

### Authentication Issues
1. Verify your SESSION_SECRET is set in `.env`
2. Clear your browser cookies and try logging in again
3. Check that all fields meet the validation requirements:
   - Name: 20-60 characters
   - Password: 8-16 characters, must include uppercase and special character
   - Email: Must be valid format
   - Address: Max 400 characters