const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const router = express.Router();

// ==================== 登入頁 ====================
router.get('/login', (req, res) => {
  if (req.user) return res.redirect('/tasks');
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && await user.comparePassword(req.body.password)) {
      req.session.user = { id: user._id, username: user.username };
      const tasks = await Task.find({ owner: user._id }).sort({ createdAt: -1 });
      res.render('tasks/index', { 
        user: req.session.user, 
        tasks, 
        query: {} 
      });
    } else {
      res.render('login', { error: '帳號或密碼錯誤' });
    }
  } catch (err) {
    console.error(err);
    res.render('login', { error: '伺服器錯誤，請稍後再試' });
  }
});

// ==================== 註冊頁 ====================
router.get('/register', (req, res) => {
  if (req.user) return res.redirect('/tasks');
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    req.session.user = { id: user._id, username: user.username };
    res.render('tasks/index', { 
      user: req.session.user, 
      tasks: [], 
      query: {} 
    });
  } catch (err) {
    res.render('register', { error: '此帳號已存在！' });
  }
});

// ==================== 修改密碼 ====================
router.get('/change-password', (req, res) => {
  if (!req.user) return res.redirect('/auth/login');
  res.render('change-password', { user: req.user });
});

router.post('/change-password', async (req, res) => {
  if (!req.user) return res.redirect('/auth/login');

  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id);

  // 驗證舊密碼
  if (!await user.comparePassword(oldPassword)) {
    return res.render('change-password', { 
      error: '舊密碼錯誤！', 
      user: req.user 
    });
  }

  // 驗證新密碼一致性
  if (newPassword !== confirmPassword) {
    return res.render('change-password', { 
      error: '兩次新密碼不一致！', 
      user: req.user 
    });
  }

  // 驗證長度
  if (newPassword.length < 6) {
    return res.render('change-password', { 
      error: '新密碼至少需 6 個字元！', 
      user: req.user 
    });
  }

  // 更新密碼（bcrypt 會自動加密）
  user.password = newPassword;
  await user.save();

  // 成功後強制登出（最安全做法）
  res.send(`
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>密碼修改成功</title>
  <style>
    body{font-family:Arial;background:#f8f9fa;text-align:center;padding:100px}
    .box{background:white;padding:50px;border-radius:15px;box-shadow:0 10px 30px rgba(0,0,0,0.1);display:inline-block}
    h2{color:#28a745;font-size:28px}
    a{background:#007bff;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-size:18px;margin-top:20px;display:inline-block}
  </style>
</head>
<body>
  <div class="box">
    <h2>密碼修改成功！</h2>
    <p>為了安全，請重新登入</p>
    <a href="/auth/logout">點這裡登出並重新登入</a>
  </div>
</body>
</html>
  `);
});

// ==================== 登出 ====================
router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/auth/login');
});

module.exports = router;