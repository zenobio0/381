const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// GET /api/tasks?title=...&status=...&priority=...
router.get('/', async (req, res) => {
  const query = {};
  if (req.query.title) query.title = new RegExp(req.query.title, 'i');
  if (req.query.status) query.status = req.query.status;
  if (req.query.priority) query.priority = req.query.priority;

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  res.json(tasks);
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const task = await Task.create(req.body);  // In real app, you may want validation
  res.status(201).json(task);
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;