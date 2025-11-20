require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const apiRoutes = require('./routes/api');

const app = express();

// 1. MongoDB 連線
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB 連線失敗:', err));

// 2. 中間件設定
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));  // 解析 form
app.use(express.json());                          // 解析 JSON

// 3. cookie-session（登入狀態）
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'my-super-secret-key-123456'],
  maxAge: 24 * 60 * 60 * 1000  // 24 小時
}));

// 4. 把 session 中的 user 放到 req.user（所有路由都能用）
app.use((req, res, next) => {
  req.user = req.session.user || null;
  res.locals.user = req.session.user || null;  // 讓 ejs 直接用 <%= user.username %>
  next();
});

// 5. 路由
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/tasks', apiRoutes);

// 6. 首頁（自動導向登入或任務頁）
app.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/tasks');
  } else {
    res.redirect('/auth/login');
  }
});

// 7. 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);