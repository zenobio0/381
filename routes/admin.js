const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const router = express.Router();

// ========= 保護：只有 username 為 admin 才能進來 =========
router.use((req, res, next) => {
  if (!req.session?.user || req.session.user.username !== 'admin') {
    return res.status(403).send(`
      <h1 style="text-align:center;margin-top:100px;color:#dc3545">
        禁止存取！你不是管理員
      </h1>
      <p style="text-align:center"><a href="/">← 回首頁</a></p>
    `);
  }
  next();
});

// ========= 管理員首頁 =========
router.get('/', async (req, res) => {
  const users = await User.find().select('username createdAt').sort({ createdAt: -1 });

  res.send(`
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>管理員面板 - TaskFlow</title>
  <style>
    body{font-family:Arial,sans-serif;background:#f4f5f7;margin:0;padding:20px}
    .container{max-width:1000px;margin:auto;background:white;padding:30px;border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,0.1)}
    h1{color:#007bff}
    table{width:100%;border-collapse:collapse;margin:25px 0}
    th,td{border:1px solid #ddd;padding:14px;text-align:center}
    th{background:#007bff;color:white}
    .btn{display:inline-block;padding:8px 14px;margin:0 5px;border-radius:6px;text-decoration:none;font-size:14px}
    .reset-btn{background:#ffc107;color:black}
    .delete-btn{background:#dc3545;color:white}
    .delete-btn:hover{background:#c82333}
    .add-form{margin-top:30px;padding:20px;background:#f8f9fa;border-radius:8px}
    input{padding:10px;margin:5px;width:200px;border:1px solid #ddd;border-radius:6px}
    button{background:#28a745;color:white;padding:10px 20px;border:none;border-radius:6px;cursor:pointer}
    button:hover{background:#218838}
  </style>
</head>
<body>
<div class="container">
  <h1>管理員面板</h1>
  <p>
    歡迎，超級管理員 <b>${req.session.user.username}</b>！
    <a href="/auth/logout">登出</a> | 
    <a href="/tasks">回我的任務</a>
  </p>
  <hr>

  <h2>所有使用者（共 ${users.length} 人）</h2>
  <table>
    <tr><th>帳號</th><th>註冊時間</th><th>操作</th></tr>
    ${users.map(u => `
      <tr>
        <td><b>${u.username}</b></td>
        <td>${new Date(u.createdAt).toLocaleString('zh-TW')}</td>
        <td>
          <a href="/admin/reset-password/${u._id}" class="btn reset-btn">重設密碼</a>
          ${u.username === 'admin' 
            ? '<span style="color:#666">不能刪除自己</span>' 
            : `<a href="/admin/delete/${u._id}" class="btn delete-btn" 
                 onclick="return confirm('確定要永久刪除 ${u.username} 及其所有任務嗎？')">刪除使用者</a>`
          }
        </td>
      </tr>
    `).join('')}
  </table>

  <div class="add-form">
    <h3>手動新增使用者（測試用）</h3>
    <form action="/admin/create" method="POST">
      <input type="text" name="username" placeholder="新帳號" required minlength="3">
      <input type="password" name="password" placeholder="密碼" required minlength="6">
      <button type="submit">新增使用者</button>
    </form>
  </div>
</div>
</body>
</html>
  `);
});

// ========= 刪除使用者（連任務一起刪）=========
router.get('/delete/:id', async (req, res) => {
  await Task.deleteMany({ owner: req.params.id });
  await User.deleteOne({ _id: req.params.id });
  res.redirect('/admin');
});

// ========= 管理員幫使用者重設密碼 =========
router.get('/reset-password/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.send('使用者不存在');

  res.send(`
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>重設密碼</title>
<style>body{font-family:Arial;background:#f8f9fa;padding:50px;text-align:center}
input{padding:12px;width:300px;margin:10px;border:1px solid #ddd;border-radius:6px}
button{background:#28a745;color:white;padding:12px 30px;border:none;border-radius:6px;cursor:pointer}</style>
</head>
<body>
  <h2>為 <b>${user.username}</b> 重設密碼</h2>
  <form action="/admin/reset-password/${user._id}" method="POST">
    <input type="password" name="newPassword" placeholder="輸入新密碼（至少6個字）" required minlength="6"><br>
    <button type="submit">確認重設</button>
  </form>
  <p><a href="/admin">← 返回管理員面板</a></p>
</body></html>
  `);
});

router.post('/reset-password/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.send('使用者不存在');

  user.password = req.body.newPassword;  // bcrypt 會自動加密
  await user.save();

  res.send(`
<!DOCTYPE html>
<html><body style="text-align:center;margin-top:100px;font-family:Arial">
  <h2 style="color:green">成功！</h2>
  <h3>${user.username} 的新密碼已設為：<br><b>${req.body.newPassword}</b></h3>
  <p><a href="/admin">← 返回管理員面板</a></p>
</body></html>
  `);
});

// ========= 手動新增使用者 =========
router.post('/create', async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect('/admin');
  } catch (err) {
    res.send(`
      <h3 style="color:red">帳號已存在或格式錯誤！</h3>
      <p><a href="/admin">← 返回</a></p>
    `);
  }
});

module.exports = router;