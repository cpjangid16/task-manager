# Task Manager Web Application

A modern task management solution built with the MERN stack (MySQL, Express.js, React.js, Node.js) featuring a beautiful Material-UI interface.

## 🌟 Features

- **User Authentication**
  - Secure JWT-based authentication
  - User registration and login
  - Protected routes
  - Profile management

- **Task Management**
  - Create, read, update, and delete tasks
  - Task status tracking (pending, in-progress, completed)
  - Priority levels (high, medium, low)
  - Due date management
  - Task categorization

- **Dashboard Analytics**
  - Task statistics overview
  - Status-based task counts
  - Recent tasks list
  - Visual progress indicators

- **Advanced Features**
  - Real-time updates using Socket.IO
  - Responsive Material-UI design
  - Advanced filtering and search
  - Task assignment capabilities
  - Role-based access control

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MySQL with Sequelize ORM
- JWT for authentication
- Socket.IO for real-time features
- bcryptjs for password hashing
- dotenv for environment management

### Frontend
- React.js
- Material-UI components
- React Router for navigation
- Axios for API requests
- Context API for state management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn
- Git

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cpjangid16/task-manager.git
   cd task-manager
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Configuration

### Backend Configuration
Create a `.env` file in the server directory:
```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h

# Client Configuration
CLIENT_URL=http://localhost:3000

# API Configuration
API_URL=http://localhost:5000/api
```

### Frontend Configuration
Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AUTH_TOKEN_KEY=token
```

## 🏃‍♂️ Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## 🏗️ Project Structure

```
task-manager/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # React components
│       ├── contexts/      # Context providers
│       └── App.js         # Main application
├── server/                # Node.js backend
│   └── src/              # Source files
│       ├── config/       # Configuration files
│       ├── controllers/  # Route controllers
│       ├── middleware/   # Custom middleware
│       ├── models/       # Database models
│       ├── routes/       # API routes
│       └── utils/        # Utility functions
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [cpjangid16](https://github.com/cpjangid16)

## 🙏 Acknowledgments

- Material-UI for the beautiful components
- React community for the amazing tools and libraries
- All contributors who have helped shape this project 