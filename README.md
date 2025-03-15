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
- PostgreSQL 15 or later

### Database Setup
1. Install PostgreSQL if you haven't already
2. Create a new database:
```sql
CREATE DATABASE store_ratings;
```

### Project Setup
1. Clone the repository
2. Copy the environment file:
```bash
cp .env.example .env
```
3. Update the `.env` file with your PostgreSQL credentials
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
