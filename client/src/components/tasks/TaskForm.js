import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import axios from 'axios';

// Use environment variables with fallbacks
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const AUTH_TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || 'token';
const LOGIN_PATH = process.env.REACT_APP_LOGIN_PATH || '/login';
const TASKS_PATH = process.env.REACT_APP_TASKS_PATH || '/tasks';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: '',
    dueDate: '',
  });

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      navigate(LOGIN_PATH);
      return;
    }

    if (id) {
      fetchTask();
    }
  }, [id, navigate]);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        navigate(LOGIN_PATH);
        return;
      }

      const response = await api.get(`/api/tasks/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      
      const taskData = response.data;
      setTask({
        ...taskData,
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString().split('T')[0]
          : '',
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        navigate(LOGIN_PATH);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch task');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        navigate(LOGIN_PATH);
        return;
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      };

      if (id) {
        await api.put(`/api/tasks/${id}`, task, config);
      } else {
        await api.post('/api/tasks', task, config);
      }
      navigate(TASKS_PATH);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        navigate(LOGIN_PATH);
      } else {
        setError(err.response?.data?.message || 'Failed to save task');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {id ? 'Edit Task' : 'New Task'}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              value={task.title}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={task.description}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={task.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={task.priority}
                label="Priority"
                onChange={handleChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              label="Category"
              name="category"
              value={task.category}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={task.dueDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(TASKS_PATH)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Saving...' : id ? 'Update Task' : 'Create Task'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default TaskForm; 