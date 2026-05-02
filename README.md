TaskFlowManager
TaskFlowManager is a full-stack web application designed to help teams manage projects and tasks efficiently. Users can create projects, assign tasks, and track progress with role-based access (Admin / Member).

---
Features

* User Authentication (Signup / Login)
* Project creation and management
* Add team members to projects
* Task creation and assignment
* Task status tracking (Pending, In Progress, Completed)
* Dashboard with task overview and overdue tasks
* Role-based access control:

  * Admin: Full control (create projects, assign tasks)
  * Member: View and update assigned tasks

---
 Tech Stack

Frontend:

* React.js

Backend:

* Node.js
* Express.js

Database:

* MongoDB

Deployment:

* Railway (Backend)

---

Project Structure

TaskFlowManager/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   └── React application
│
└── README.txt

---
 Setup Instructions

1. Clone the repository:
   git clone https://github.com/your-username/TaskFlowManager.git

2. Navigate to backend:
   cd backend

3. Install dependencies:
   npm install

4. Start backend:
   npm start

5. Navigate to frontend:
   cd ../frontend

6. Install dependencies:
   npm install

7. Start frontend:
   npm start

---

Live Deployment

Backend (Railway):
https://taskflowmanager-production-e24c.up.railway.app

(Note: Use API routes like /api for testing)

---
 API Endpoints

Authentication:

* POST /api/auth/register
* POST /api/auth/login

Projects:

* GET /api/projects
* POST /api/projects

Tasks:

* GET /api/tasks
* POST /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

---
 Role-Based Access Control

Admin:

* Create and manage projects
* Assign tasks to members
* View all tasks

Member:

* View assigned tasks
* Update task status

---
 Submission

Live URL:
https://taskflowmanager-production-e24c.up.railway.app

GitHub Repository:
https://github.com/gorantlavinay05/TaskFlowManager
---
