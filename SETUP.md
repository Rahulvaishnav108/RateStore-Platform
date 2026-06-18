# Local Setup Guide

This guide helps another developer run the RateStore Platform locally from a fresh clone.

## 1. Requirements

Install these first:

- Node.js 18 or newer
- npm
- MySQL 8
- Git

Check versions:

```bash
node --version
npm --version
mysql --version
git --version
```

## 2. Clone the Repository

```bash
git clone https://github.com/Rahulvaishnav108/RateStore-Platform.git
cd RateStore-Platform
```

## 3. Database Setup

Start MySQL locally and make sure you have a user that can create databases.

The backend automatically creates the configured database and tables on startup. By default, the database name is:

```text
store_rating_db
```

## 4. Backend Setup

Go to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES=7d
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

Expected backend URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## 5. Seed Demo Data

In another terminal:

```bash
cd backend
npm run seed
```

This creates demo users, stores, and ratings.

Demo credentials:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@storerating.com | Admin@123 |
| Normal User | ankit@gmail.com | User@1234 |
| Store Owner | rajesh.owner@gmail.com | Owner@123 |

## 6. Frontend Setup

Open a new terminal from the project root:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Expected frontend URL:

```text
http://localhost:5173
```

This project also supports:

```text
http://127.0.0.1:5173
```

## 7. Useful Commands

Backend:

```bash
cd backend
npm start
npm run seed
```

Frontend:

```bash
cd frontend
npm run dev
npm run type-check
npm run lint
npm run build
```

## 8. Common Problems

### CORS error during login

Use one of these frontend URLs:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Also confirm the backend is running on:

```text
http://localhost:5000
```

### MySQL connection error

Check:

- MySQL service is running.
- `backend/.env` has the correct `DB_USER`.
- `backend/.env` has the correct `DB_PASS`.
- `DB_HOST` is `127.0.0.1` or `localhost`.
- `DB_PORT` is usually `3306`.

### Demo login does not work

Run the seed command again:

```bash
cd backend
npm run seed
```

Then retry with the demo credentials.

## 9. Production Notes

Before deploying:

- Use a strong `JWT_SECRET`.
- Use production MySQL credentials.
- Set `FRONTEND_URL` to the deployed frontend origin.
- Set `VITE_API_URL` to the deployed backend API URL.
- Do not commit `.env` files.
