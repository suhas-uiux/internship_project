const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const User = require('../models/User');

const router = express.Router();

// CREATE task (Manager/Admin only)
// CREATE task (Manager/Admin only)
router.post('/', authMiddleware, checkRole(['admin', 'manager']), async (req, res) => {
    try {
      const { title, description, dueDate, assignedTo } = req.body;
  
      // Check if the assigned user exists and belongs to the same organization
      const assignedUser = await User.findOne({
        _id: assignedTo,
        organization: req.user.orgId
      });
  
      if (!assignedUser) {
        return res.status(400).json({ message: 'Invalid assigned user for this organization' });
      }
  
      const task = new Task({
        title,
        description,
        dueDate,
        createdBy: req.user.userId,
        assignedTo,
        organization: req.user.orgId,
      });
  
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// GET all tasks (Admin/Manager gets all org tasks, Member gets only theirs)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'member') {
      tasks = await Task.find({ assignedTo: req.user.userId }).populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ organization: req.user.orgId }).populate('assignedTo', 'name email');
    }

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE task (Admin can update any, Manager can update in org, Member only their own)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isSameOrg = task.organization.toString() === req.user.orgId;
    const isAssignedToUser = task.assignedTo?.toString() === req.user.userId;

    if (req.user.role === 'admin' || 
        (req.user.role === 'manager' && isSameOrg) || 
        (req.user.role === 'member' && isAssignedToUser)) {

      Object.assign(task, req.body);
      await task.save();
      return res.json(task);
    }

    return res.status(403).json({ message: 'Access denied' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE task (Admin only)
// DELETE task (Admin only, and only within their organization)
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        organization: req.user.orgId, // Ensures deletion only within the user's organization
      });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found or not in your organization' });
      }
  
      res.json({ message: 'Task deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
