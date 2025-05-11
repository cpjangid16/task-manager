# Task Manager Web Application

A comprehensive task management solution built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication with JWT
- Role-Based Access Control
- CRUD Operations for Tasks
- Real-Time Updates
- Responsive Design
- Advanced Search and Filtering
- Task Notifications
- Dashboard Analytics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Git

## Project Structure

```
task-manager/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Task Endpoints

- GET /api/tasks - Get all tasks
- POST /api/tasks - Create a new task
- GET /api/tasks/:id - Get a specific task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 