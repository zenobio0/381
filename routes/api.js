// routes/api.js  ← 加上 session 驗證的版本（推薦）
const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// 重要！加上和 tasks.js 一樣的登入驗證
router.use((req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: '請先登入（Unauthorized）' });
  }
  next();
});

// 所有 API 都只操作「登入者的任務」
const getOwnerQuery = () => ({ owner: req.session.user.id });

// GET /api/tasks?title=xxx&status=xxx
router.get('/', async (req, res) => {
  const query = getOwnerQuery();

  if (req.query.title) query.title = new RegExp(req.query.title, 'i');
  if (req.query.status) query.status = req.query.status;
  if (req.query.priority) query.priority = req.query.priority;

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  res.json(tasks);
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const task = await Task.create({
    ...req.body,
    owner: req.session.user.id   // 強制綁定擁有者
  });
  res.status(201).json(task);
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.session.user.id },
    req.body,
    { new: true }
  );

  if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });
  res.json(task);
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.session.user.id
  });

  if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
