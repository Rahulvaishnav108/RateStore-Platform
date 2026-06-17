# 🌟 RateStore Platform

A full-stack **Store Rating Platform** built with the MERN-adjacent stack (React + Express + MySQL). Users can browse stores, submit ratings (1–5 stars), and update them. Role-based dashboards for Admins, Normal Users, and Store Owners.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS v3, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Validation | express-validator (backend) + inline (frontend) |
| Security | Helmet, CORS |

---

## ✨ Features

### Core
- ✅ Role-based authentication (Admin / Normal User / Store Owner)
- ✅ JWT-protected routes with middleware guard
- ✅ Secure password hashing with bcryptjs (12 salt rounds)
- ✅ Change password (verify old → set new)
- ✅ Form validations (frontend + backend, matching spec rules)

### Admin
- ✅ Dashboard analytics: Total Users, Admins, Stores, Ratings, Platform Avg Rating
- ✅ Create users (any role) and stores
- ✅ View/filter/sort/paginate user list (Name, Email, Address, Role)
- ✅ View/filter/sort/paginate store list with avg rating
- ✅ Store owner's rating shown in user detail view

### Normal User
- ✅ Register / Login
- ✅ Browse all stores in card grid layout
- ✅ Debounced search by name/address
- ✅ Sort by name, rating, newest
- ✅ Submit 1–5 star rating per store
- ✅ Update existing rating (modal with current value pre-filled)
- ✅ See own rating displayed on each store card

### Store Owner
- ✅ Dashboard with store info banner
- ✅ Average rating & total ratings
- ✅ Full rating distribution (5★ → 1★ with progress bars)
- ✅ Insights panel (positive %, range, 5-star count)
- ✅ Table of all customers who rated with date

### UX/UI
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Sidebar navigation with active state
- ✅ Loading skeletons on all data fetches
- ✅ Toast notifications (success/error)
- ✅ Debounced search (400ms)
- ✅ Sortable columns (asc/desc toggle)
- ✅ Pagination with page numbers
- ✅ Demo login buttons for quick testing

---

## 🗂️ Project Structure

```
store-rating-platform/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MySQL pool + auto schema init
│   │   ├── controllers/          # Thin request/response handlers
│   │   ├── services/             # Business logic layer
│   │   ├── routes/               # Express route definitions
│   │   ├── middleware/           # JWT auth, role check, error handler
│   │   ├── validators/           # express-validator rule sets
│   │   └── utils/                # Token gen, response handler, pagination
│   ├── server.js
│   ├── seed.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Sidebar, Layout, DataTable, StarRating, StatCard
│   │   ├── context/AuthContext   # Global auth state
│   │   ├── hooks/useDebounce     # Debounce hook
│   │   ├── pages/
│   │   │   ├── auth/             # Login, Register, ChangePassword
│   │   │   ├── admin/            # AdminDashboard, Users, AdminStores
│   │   │   ├── user/             # UserDashboard, StoreListing
│   │   │   └── owner/            # OwnerDashboard
│   │   ├── services/api.js       # Axios instance with interceptors
│   │   └── App.jsx               # Route definitions
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 📋 Form Validation Rules

| Field | Rule |
|---|---|
| Name | Min 20, Max 60 characters |
| Email | Standard email format |
| Address | Max 400 characters |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special character |
| Rating | Integer 1–5 |

---

## 🗄️ Database Schema

```sql
users       (id, name, email, password_hash, address, role, created_at)
stores      (id, name, email, address, owner_id FK, created_at)
ratings     (id, user_id FK, store_id FK, rating 1-5, created_at, updated_at)
            UNIQUE(user_id, store_id)
```

---

## 🌐 API Reference

### Auth  `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, returns JWT |
| PUT | `/change-password` | ✅ Any | Change password |
| GET | `/me` | ✅ Any | Get current user |

### Admin  `/api/admin`  *(Admin only)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Stats: users, stores, ratings, avg |
| GET | `/users` | List users (filter, sort, paginate) |
| GET | `/users/:id` | User detail with store rating |
| POST | `/users` | Create user (any role) |
| GET | `/stores` | List stores (filter, sort, paginate) |
| POST | `/stores` | Create store |

### Stores  `/api/stores`  *(User only)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | All stores with user's rating & avg |

### Ratings  `/api/ratings`  *(User only)*
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Submit rating for a store |
| PUT | `/:id` | Update own rating |

### Owner  `/api/owner`  *(Store Owner only)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Store analytics + raters list |

---

## ⚙️ Setup (Local — No Docker)

### Prerequisites
- Node.js 18+
- MySQL 8.0 running locally

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env — set DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET
npm install
npm start
# Auto-creates tables on first run
```

### Seed Sample Data
```bash
cd backend
node seed.js
```

### Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## 🐳 Docker Setup

```bash
# Start MySQL + Backend together
docker-compose up -d

# Then seed data
docker exec store_rating_backend node seed.js

# Start frontend locally
cd frontend && npm run dev
```

---

## 🔑 Test Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@storerating.com | Admin@123 |
| Normal User | ankit@gmail.com | User@1234 |
| Store Owner | rajesh.owner@gmail.com | Owner@123 |

> **Shortcut:** The login page has one-click demo buttons to auto-fill credentials.

---

## 🏗️ Architecture

```
Three-Tier MVC with Role-Based Access Control

Presentation  →  React.js + Vite + Tailwind
Application   →  Express.js REST API (MVC)
Data          →  MySQL 8 (raw mysql2/promise)
Security      →  JWT + bcryptjs + Helmet + CORS
```

---

## 👨‍💻 Author

**Rahul Vaishnav**  
📧 rahul06vaishnav@gmail.com  
🐙 [github.com/rahul06vaishnav](https://github.com/rahul06vaishnav)  
💼 [linkedin.com/in/rahul06vaishnav](https://linkedin.com/in/rahul06vaishnav)
