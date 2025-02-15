# Quizzo

Quizzo is a full-stack Quiz Management System designed for teachers to create, manage, and view quizzes. The application features a modern tech stack with a Next.js frontend, an Express/TypeScript backend, and a PostgreSQL database, all containerized using Docker and Docker Compose.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)

## Features

- **User Authentication:** Login and Signup functionality
- **Quiz Management:** Create, read, update, and delete quizzes
- **Responsive UI:** Built with Next.js, Tailwind CSS, and ShadCN UI components
- **Backend API:** Developed with Express, TypeScript, and Prisma
- **Database:** PostgreSQL for persistent data storage
- **Containerized:** Easily deployed with Docker and Docker Compose

## Tech Stack

- **Frontend:**
    - Next.js
    - React
    - Tailwind CSS
    - ShadCN UI
    - Framer Motion

- **Backend:**
    - Express
    - TypeScript
    - Prisma

- **Database:**
    - PostgreSQL (via Docker)

- **Containerization:**
    - Docker
    - Docker Compose

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### Local Development

1. **Clone the Repository**
     ```bash
     git clone https://github.com/yourusername/quizzo.git
     cd quizzo
     ```

2. **Backend Setup**
     ```bash
     cd backend
     npm install
     npm run build
     ```

3. **Frontend Setup**
     ```bash
     cd ../frontend
     npm install
     ```

4. **Environment Variables**

     Create `.env` files with these configurations:

     **Backend (`backend/.env`):**
     ```env
     PORT=5000
     DATABASE_URL="postgresql://quizzo_user:quizzo_pass@db:5432/quizzo_db?schema=public"
     ```

     **Frontend (`frontend/.env`):**
     ```env
     NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
     PORT=3000
     NODE_ENV=development
     ```

## Usage

### Running Locally

**Backend Development:**
```bash
cd backend
npm install
npm run dev
```
Access at: [http://localhost:5000](http://localhost:5000)

**Frontend Development:**
```bash
cd frontend
npm install
npm run dev
```
Access at: [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
cd frontend
npm install
npm run build
```

## Docker Setup

### migrate the db first
```bash
docker compose run backend npx prisma migrate deploy    
```


### Build and Start Containers
```bash
docker compose up --build
```

### Services

- **Database:** PostgreSQL @ `localhost:5433`
- **Backend:** Express server @ `localhost:5000`
- **Frontend:** Next.js app @ `localhost:3000`

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string

### Frontend
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL
