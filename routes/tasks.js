const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// 保護路由：沒登入就踢回登入頁
router.use((req, res, next) => {
  if (!req.session?.user) {
    return res.redirect('/auth/login');
  }
  res.locals.user = req.session.user;  // 讓所有 ejs 都能用 <%= user.username %>
  next();
});

// 任務列表
router.get('/', async (req, res) => {
  const query = { owner: req.session.user.id };
  if (req.query.title) query.title = new RegExp(req.query.title, 'i');
  if (req.query.status) query.status = req.query.status;
  if (req.query.priority) query.priority = req.query.priority;

  const tasks = await Task.find(query).sort({ createdAt: -1 });
  res.render('tasks/index', { tasks, query: req.query });
});

// 新增任務頁
router.get('/new', (req, res) => res.render('tasks/new'));

// 建立任務
router.post('/', async (req, res) => {
  await Task.create({ ...req.body, owner: req.session.user.id });
  res.redirect('/tasks');
});

// 編輯頁
router.get('/:id/edit', async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.session.user.id });
  if (!task) return res.status(404).send('Task not found');
  res.render('tasks/edit', { task });
});

// 更新任務
router.post('/:id', async (req, res) => {
  await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.session.user.id },
    req.body
  );
  res.redirect('/tasks');
});

// 刪除任務
router.post('/:id/delete', async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, owner: req.session.user.id });
  res.redirect('/tasks');
});

module.exports = router;