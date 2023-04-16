const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/postModel');
const User = require('../models/userModel');

router.get('/', async (req, res) => {
  try {
    const timeSort = req.params.sort == 'asc' ? 'createdAt' : '-createdAt';
    const q =
      req.params.q !== undefined ? { content: new RegExp(req.params.q) } : {};
    const data = await Post.find(q)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .sort(timeSort);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
    console.log(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await Post.create({
      user: req.body.user,
      content: req.body.content,
    });
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
    console.log(error);
  }
});

module.exports = router;
