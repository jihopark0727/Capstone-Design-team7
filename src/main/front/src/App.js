const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 세션 설정
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// 로그인 페이지
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

// 회원가입 페이지
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/views/signup.html');
});

// 대시보드 (로그인 후 접근 가능)
app.get('/dashboard', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(__dirname + '/views/dashboard.html');
  } else {
    res.redirect('/login');
  }
});

// 서버 실행
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
