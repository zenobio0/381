require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();

// ==================== 1. MongoDB 連線（最新版 Mongoose 8.x 最佳設定）====================
// 千萬不要再寫 bufferMaxEntries！新版已移除
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,   // 30秒
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow', mongooseOptions)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB 連線失敗:', err.message));

// ==================== 2. 中間件 ====================
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'taskflow-secret-2025'],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use((req, res, next) => {
  req.user = req.session.user || null;
  res.locals.user = req.session.user || null;
  next();
});

// ==================== 3. 路由（一定要在 listen 前面！）====================
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/tasks', apiRoutes);    // 千萬不能漏！
app.use('/admin', adminRoutes);

// 首頁
app.get('/', (req, res) => {
  req.user ? res.redirect('/tasks') : res.redirect('/auth/login');
});

// 404
app.use((req, res) => {
  res.status(404).send('<h1>404 - Not Found</h1>');
});

// ==================== 4. 啟動 ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Cloud URL: https://three81-0jmu.onrender.com`);
  console.log(`API: https://three81-0jmu.onrender.com/api/tasks`);
});
