# TaskFlow Manager

A full-stack project management application with role-based access control, allowing Admins to create projects and assign tasks, and Members to track and update task statuses.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, React Router, Axios, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth, bcrypt

## Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file with your MongoDB credentials (already set up in your case).
4. Start the development server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a separate terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Usage
- Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).
- **Admin**: Register a new account and select the "Admin" role to create projects and assign tasks.
- **Member**: Register an account as "Member" to view assigned tasks and update their status.
