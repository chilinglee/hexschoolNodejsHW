const http = require('http');
const mongoose = require('mongoose');
const Post = require('./model/post');
const express = require('express');
require('dotenv').config();

const DBConnection = process.env.DBSTRING.replace(
  '<password>',
  process.env.PASSWORD
);

mongoose
  .connect(DBConnection)
  .then(() => {
    console.log('連綫成功');
  })
  .catch((err) => {
    console.log(err);
  });

const headers = {
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Request-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
  'Content-Type': 'application/json',
};

const reqListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/posts' && req.method === 'GET') {
    try {
      const data = await Post.find();
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data,
        })
      );
      res.end();
    } catch (error) {
      res.headers(400, headers);
      res.write(
        JSON.stringify({
          status: 'failed',
          error,
        })
      );
      res.end();
    }
  } else if (req.url === '/post' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const newPost = JSON.parse(body);
        const result = await Post.create(newPost);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            result,
          })
        );
        res.end();
      } catch (error) {
        res.headers(400, headers);
        res.write(
          JSON.stringify({
            status: 'failed',
            error,
          })
        );
        res.end();
      }
    });
  } else if (req.url.startsWith('/post') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const post = JSON.parse(body);
        const id = req.url.split('/').pop();
        const uresult = await Post.findByIdAndUpdate(id, post);
        const upost = await Post.findById(id);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: 'success',
            oldpost: uresult,
            result: upost,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: 'failed',
            error,
          })
        );
        res.end();
      }
    });
  } else if (req.url.startsWith('/post') && req.method === 'DELETE') {
    try {
      const did = req.url.split('/').pop();
      const dresult = await Post.findByIdAndDelete(did);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          result: dresult,
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(400, headers);
      res.write(
        JSON.stringify({
          status: 'failed',
          error,
        })
      );
      res.end();
    }
  } else if (req.methods === 'OPTIONS') {
    //一些驗證機制
    //一些驗證機制
    //一些驗證機制
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
};

const server = http.createServer(reqListener);
server.listen(process.env.PORT);
