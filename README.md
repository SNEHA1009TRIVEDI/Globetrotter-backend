# The Globetrotter Challenge

## Overview
The Globetrotter Challenge is a full-stack travel guessing game that presents players with clues about a random travel destination. Players guess the correct location and can challenge their friends to play. The project follows **SOLID principles** and uses **AI-generated clues, fun facts, and a multiplayer invite feature**.

## Tech Stack


### Frontend:
- **React.js** (UI framework)
- **TypeScript** (for type safety)
- **CSS** (for styling)

### Backend:
- **Nest.js** (server-side framework)
- **PostgreSQL** (database)
- **TypeORM** (object-relational mapper)
- **JWT Authentication** (for user login and tracking scores)

---

# Frontend Setup

## Prerequisites
- Node.js (v16 or later)
- npm or yarn

## Installation
```sh
cd frontend  # Navigate to frontend folder
yarn install  # Install dependencies
```

## Environment Variables
Create a `.env` file in the frontend root and add:
```sh
VITE_BACKEND_URL=http://localhost:3080  # Replace with actual backend URL
```

## Running the Frontend
```sh
yarn dev  # Starts the development server
```

## Features
- AI-generated location clues
- Fun facts reveal after answering
- Score tracking
- Challenge a friend via shareable links

---

# Backend Setup

## Prerequisites
- Node.js (v16 or later)
- PostgreSQL

## Installation
```sh
cd backend  # Navigate to backend folder
yarn install  # Install dependencies
```

## Environment Variables
Create a `.env` file in the backend root and add:
```sh
PORT=3080
DATABASE_URL=postgres://username:password@localhost:5432/globetrotter
JWT_SECRET=your_secret_key
```

## Running the Backend
```sh
yarn start:dev  # Starts the Nest.js backend in development mode
```

## API Endpoints
### Authentication
- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and get JWT token

### Game
- `GET /locations/random` – Fetch a random travel location with clues
- `POST /locations/submit` – Submit an answer
- `GET /locations/invite-score` – Get inviter’s score
- `POST /locations/reset-score` – Reset score

### Challenge
- `POST /challenge/invite` – Generate an invite link for friends

---

# Deployment
### Frontend:
```sh
yarn build  # Create production build
```
Host the `dist/` folder on **Vercel/Netlify**.

### Backend:
```sh
yarn build  # Build Nest.js app
yarn start:prod  # Start backend in production
```
Deploy on **Render/Heroku/AWS**.

---

# Contribution
1. Fork the repository.
2. Create a new branch (`feature-xyz`).
3. Commit changes and push.
4. Open a pull request.

---

# License
MIT License

Enjoy playing *The Globetrotter Challenge*! 🌍🎉
