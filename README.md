# SkillSync — Smart Job & Internship Tracker

A full-stack MERN starter project with a distinctive dark, electric-lime + violet dashboard UI.

## Features
- Register/login with JWT authentication
- Dashboard statistics and application pipeline
- Create, edit, delete and search applications
- Status tracking: Applied, Interview, Selected, Rejected
- Job requirement vs. student skill matching (transparent keyword-based score)
- Interview/deadline date fields and upcoming deadline panel
- Analytics chart and status distribution
- Profile skills management
- Responsive layout

## Stack
- Frontend: React + Vite + React Router + Recharts + Lucide React
- Backend: Node.js + Express + MongoDB + Mongoose
- Authentication: bcryptjs + JWT

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1. Backend
```bash
cd server
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```
Backend defaults to `http://localhost:5000`.

### 2. Frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## Demo workflow
1. Register an account.
2. Add applications from the Applications page.
3. Add your skills in Profile to improve the skill match score.
4. Use the dashboard filters and charts to track progress.

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/applications`
- `POST /api/applications`
- `GET /api/applications/:id`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`
- `GET /api/analytics`
- `PUT /api/auth/profile`

All application and analytics routes require `Authorization: Bearer <token>`.

## Important notes
- This is an educational portfolio starter, not a production-hardened service.
- Skill matching uses a simple keyword overlap score, not an AI model.
- Browser notifications are optional and require permission; the dashboard also displays deadlines in-app.
- Before production deployment, add rate limiting, email verification, password reset, stronger validation, tests, audit logging, and deployment-specific CORS settings.
