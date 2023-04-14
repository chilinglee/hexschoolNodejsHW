const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');

router.get('/', async (req, res) => {
  try {
    const data = await Post.find();
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await Post.create(req.body);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      content: req.body.content,
    });
    const data = await Post.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
});

module.exports = router;
