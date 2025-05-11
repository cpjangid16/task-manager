const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    console.log("inside the task fetching");
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { createdBy: req.user.id },
          { assignedTo: req.user.id }
        ]
      },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'assignee', attributes: ['id', 'username'] }
      ]
    });
    console.log("this is the tasks",tasks);
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching tasks' 
    });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Format dueDate if provided
    let formattedDueDate = null;
    if (dueDate) {
      const date = new Date(dueDate);
      if (!isNaN(date.getTime())) {
        formattedDueDate = date;
      }
    }
    
    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: formattedDueDate,
      assignedTo,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating task' 
    });
  }
});

// Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [
          { createdBy: req.user.id },
          { assignedTo: req.user.id }
        ]
      },
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'assignee', attributes: ['id', 'username'] }
      ]
    });

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching task' 
    });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user is authorized to update the task
    if (task.createdBy !== req.user.id && task.assignedTo !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this task' 
      });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    
    // Format dueDate if provided
    let formattedDueDate = task.dueDate;
    if (dueDate) {
      const date = new Date(dueDate);
      if (!isNaN(date.getTime())) {
        formattedDueDate = date;
      }
    }

    const updatedTask = await task.update({
      title: title || task.title,
      description: description || task.description,
      status: status || task.status,
      priority: priority || task.priority,
      dueDate: formattedDueDate,
      assignedTo: assignedTo || task.assignedTo
    });

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating task' 
    });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Only creator can delete the task
    if (task.createdBy !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this task' 
      });
    }

    await task.destroy();
    res.json({ 
      success: true,
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting task' 
    });
  }
});

module.exports = router; 