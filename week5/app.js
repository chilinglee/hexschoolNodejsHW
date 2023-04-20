var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

// 程式出現重大錯誤時
// 程式到這兒還是會 crush，但留存 log 記錄
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！');
  console.error(err.name);
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

require('dotenv').config();
const DBConnection = process.env.DBPATH.replace(
  '<password>',
  process.env.PASSWORD
);
mongoose
  .connect(DBConnection)
  .then(() => {
    console.log('DB connected.');
  })
  .catch((error) => {
    console.log(error);
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// 404 錯誤
app.use(function (req, res, next) {
  res.status(404).json({
    status: 'Error',
    message: '無此路由資訊',
  });
});

// express 錯誤處理
// 自己設定的 err 錯誤
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'Error',
      message: err.message,
    });
  } else {
    console.log('發生重大錯誤', err);
    res.status(500).json({
      status: 'Error',
      message: '系統錯誤，請聯絡系統管理員。',
    });
  }
};

const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

app.use(function (err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // production
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入！';
    err.isOperational = true;
    return resErrorProd(err, res);
  }

  resErrorProd(err, res);
});

process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
