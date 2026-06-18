# RateStore Platform

A full-stack store rating platform built for the FullStack Intern Coding Challenge. The application lets normal users register, browse stores, submit or update 1-5 star ratings, while admins manage users/stores and store owners view rating analytics for their assigned store.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query/Table |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| Auth | JWT, bcryptjs |
| Validation | express-validator, Zod, React Hook Form |
| UI | Radix UI, react-icons, framer-motion, react-hot-toast |

## Features

### System Administrator

- Login with the shared authentication system.
- Dashboard with total users, admins, stores, submitted ratings, and average platform rating.
- Add normal users, admin users, and store owner users.
- Add stores and optionally assign a store owner.
- View, filter, sort, and paginate users by name, email, address, and role.
- View, filter, sort, and paginate stores by name, email, address, and rating.
- View user details, including store rating for store owners.
- Update and delete users/stores.

### Normal User

- Sign up and log in.
- Update password after login.
- Browse all registered stores.
- Search stores by name or address.
- Sort stores by name, rating, or creation date.
- View overall rating and own submitted rating.
- Submit a 1-5 star rating for a store.
- Update an existing rating.

### Store Owner

- Login with the shared authentication system.
- Update password after login.
- View assigned store details.
- View average rating, total ratings, rating distribution, insights, and users who rated the store.

## Validation Rules

| Field | Rule |
| --- | --- |
| Name | Minimum 20 characters, maximum 60 characters |
| Email | Standard email format |
| Address | Maximum 400 characters |
| Password | 8-16 characters, at least one uppercase letter and one special character |
| Rating | Integer from 1 to 5 |

## Project Structure

```text
store-rating-platform/
  backend/
    src/
      config/          MySQL pool and schema initialization
      controllers/     Request handlers
      middleware/      Auth, authorization, errors
      routes/          Express routes
      services/        Business logic and SQL queries
      utils/           Token, pagination, response helpers
      validators/      express-validator rules
    seed.js            Sample data and demo users
    server.js          Backend entry point
  frontend/
    src/
      components/      Layout, UI, forms, tables
      hooks/           API/query/auth hooks
      lib/             Routes, validation, utilities
      pages/           Auth, admin, user, owner pages
      services/        Axios API client
      types/           Shared TypeScript types
    vite.config.js
  docker-compose.yml
```

## Prerequisites

- Node.js 18 or newer
- MySQL 8 running locally
- npm

Docker is optional. The local setup below is the recommended path for development.

## Environment Variables

Create `backend/.env`:

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

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

The backend allows both `http://localhost:5173` and `http://127.0.0.1:5173` during local development.

## Setup and Run

For a step-by-step fresh-clone setup guide, see [SETUP.md](./SETUP.md).

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the backend:

```bash
cd backend
npm start
```

The backend runs at:

```text
http://localhost:5000
```

Seed sample data:

```bash
cd backend
npm run seed
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

You can also use:

```text
http://127.0.0.1:5173
```

## Demo Credentials

After running `npm run seed` in the backend:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@storerating.com | Admin@123 |
| Normal User | ankit@gmail.com | User@1234 |
| Store Owner | rajesh.owner@gmail.com | Owner@123 |

## Available Scripts

Backend:

```bash
npm start      # Start Express server
npm run dev    # Start Express server
npm run seed   # Reset and seed sample data
```

Frontend:

```bash
npm run dev          # Start Vite dev server
npm run build        # Build production bundle
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## API Overview

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a normal user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |

### Admin

All admin routes require an admin JWT.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | Dashboard totals |
| GET | `/api/admin/users` | List/filter/sort users |
| GET | `/api/admin/users/:id` | User details |
| POST | `/api/admin/users` | Create user |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/stores` | List/filter/sort stores |
| POST | `/api/admin/stores` | Create store |
| PUT | `/api/admin/stores/:id` | Update store |
| DELETE | `/api/admin/stores/:id` | Delete store |

### Stores and Ratings

Normal user JWT required.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/stores` | List stores with overall and own rating |
| POST | `/api/ratings` | Submit rating |
| PUT | `/api/ratings/:id` | Update own rating |
| DELETE | `/api/ratings/:id` | Delete own rating |

### Owner

Store owner JWT required.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/owner/dashboard` | Assigned store analytics and raters |

## Database Schema

```sql
users (
  id,
  name,
  email,
  password_hash,
  address,
  role,
  created_at,
  updated_at
)

stores (
  id,
  name,
  email,
  address,
  owner_id,
  created_at,
  updated_at
)

ratings (
  id,
  user_id,
  store_id,
  rating,
  created_at,
  updated_at,
  UNIQUE(user_id, store_id)
)
```

## Verification

The project has been verified with:

```bash
cd frontend && npm run type-check
cd frontend && npm run lint
cd frontend && npm run build
cd backend && node --check server.js
```

Main flow smoke tests covered login, registration, admin user/store creation, filters, store search, rating submit/update, and owner dashboard.

## Troubleshooting

If login fails with CORS in the browser, make sure the backend is running and open the frontend with one of the supported local origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

If the backend cannot connect to MySQL, confirm that MySQL is running and that `backend/.env` has the correct `DB_USER`, `DB_PASS`, host, port, and database name.
