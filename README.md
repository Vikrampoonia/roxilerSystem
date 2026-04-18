# Roxiler System - Store Rating Platform

Full-stack intern coding challenge project built with:

- Backend: Express.js + Sequelize
- Database: PostgreSQL
- Frontend: React.js (Tailwind CSS)

This application supports three roles:

- System Administrator
- Normal User
- Store Owner

Users can sign up/login, browse stores, and submit/update ratings from 1 to 5.

## Clone Repository

```bash
git clone https://github.com/Vikrampoonia/roxilerSystem.git
cd roxilerSystem
```

## Project Structure

```text
roxilerSystem/
	backend/
		src/
			app.js
			config/
			controller/
			middlewares/
			modals/
			router/
			service/
			utils/
	frontend/
		src/
			components/
			context/
			pages/
			routes/
			service/
```

## Prerequisites

Install these before setup:

1. Node.js 18+ and npm
2. PostgreSQL 14+

Optional:

- Redis (currently logout blacklist is scaffolded but not enabled)

## 1) Backend Setup

### Step 1: Install dependencies

```bash
cd backend
npm install
```

### Step 2: Create environment file

Create file: `backend/src/.env`

Add the following values:

```env
PORT=5001
JWT_SECRET=your_jwt_secret_key

DB_HOST=localhost
DB_NAME=roxiler_system
DB_USER=postgres
DB_PASS=your_postgres_password
DB_HOST= your_postgres_host

```

### Step 3: Create PostgreSQL database

Create a database named `roxiler_system` (or use your own name and update `DB_NAME`).

### Step 4: Run backend

```bash
npm run dev
```

Backend runs at:

- `http://localhost:5001`
- API base: `http://localhost:5001/api`

## 2) Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create file: `frontend/.env` (optional but recommended)

```env
REACT_APP_API_BASE_URL=http://localhost:5001/api
```

Run frontend:

```bash
npm start
```

Frontend runs at:

- `http://localhost:3000`

## 3) Running Both (Quick Start)

Use two terminals:

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm start
```

## Default Features

### Authentication

- Sign up (Normal User)
- Login for all roles
- JWT-based protected APIs

### System Administrator

- Dashboard stats (users, stores, ratings)
- Create users
- Create stores
- List users with pagination/sorting
- List stores with pagination/sorting
- View user details

### Normal User

- View stores list
- Submit rating (1-5)
- Update submitted rating
- Update profile/password

### Store Owner

- View average store rating
- View users who submitted ratings
- Update profile/password

## API Routes Summary

### Auth

- `POST /api/auth/signUp`
- `POST /api/auth/logIn`
- `POST /api/auth/logOut`

### User

- `GET /api/user/profile`
- `PUT /api/user/update-profile`
- `POST /api/user/add-rating`
- `PUT /api/user/update-rating`
- `POST /api/user/get-store`
- `GET /api/user/store-ratings-summary`
- `POST /api/user/create-user` (Admin)
- `GET /api/user/get-user` (Admin)
- `GET /api/user/get-user/:id` (Admin)

### Store

- `POST /api/store/create-store` (Admin)
- `POST /api/store/get-store` (Admin)

### Admin

- `GET /api/admin/stats`
- `GET /api/admin/dashboard-summary`

## Troubleshooting

### Backend fails to start with DB error

- Check PostgreSQL is running.
- Verify `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` in `backend/src/.env`.

### Frontend API calls fail

- Ensure backend is running on port `5001`.
- Set `REACT_APP_API_BASE_URL=http://localhost:5001/api` in `frontend/.env`.

### CORS issue

- Backend already enables `cors()` globally in app setup.
- Confirm frontend is calling correct backend URL.

## Notes

- Database tables are auto-synced by Sequelize on backend startup.
- Folder name is `modals` in this project (intentional in current codebase).
- This README is intended to make local setup straightforward for evaluators and contributors.
