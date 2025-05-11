import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  TrendingUp as InProgressIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Use environment variables with fallbacks
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const AUTH_TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || 'token';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const tasks = response.data.data;
        const stats = {
          total: tasks.length,
          completed: tasks.filter((task) => task.status === 'completed').length,
          pending: tasks.filter((task) => task.status === 'pending').length,
          inProgress: tasks.filter((task) => task.status === 'in-progress').length,
        };

        setStats(stats);
        setRecentTasks(tasks.slice(0, 5)); // Get 5 most recent tasks
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      }
      console.error('Error fetching dashboard data:', err);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
        bgcolor: color,
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h6" gutterBottom>
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography component="p" variant="h4">
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/tasks/new')}
              startIcon={<TaskIcon />}
            >
              New Task
            </Button>
          </Box>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={<TaskIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CompletedIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<PendingIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<InProgressIcon />}
            color="#9c27b0"
          />
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Tasks
            </Typography>
            <List>
              {recentTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem
                    button
                    onClick={() => navigate(`/tasks/edit/${task.id}`)}
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            Status: {task.status} | Priority: {task.priority}
                          </Typography>
                          {task.dueDate && (
                            <Typography component="span" variant="body2" color="textSecondary" display="block">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentTasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {recentTasks.length === 0 && (
                <ListItem>
                  <ListItemText primary="No tasks found" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 