const mongoose = require('mongoose');
const UserSch = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '請輸入您的姓名'],
  },
  email: {
    type: String,
    required: [true, '請輸入您的 email'],
    unique: true,
    lowercase: true,
    select: false,
  },
  photo: {
    type: String,
  },
});

const User = mongoose.model('users', UserSch);

module.exports = User;
