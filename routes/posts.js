const express = require('express');
const router = express.Router();

const comments = require("../models");
const index = require("../models");
const users = require("../models").users;
const posts = require("../models").posts;
const authMiddleware = require('../middleware/authMiddleware');

// localhost:3000/api/about GET
router.post("/posts",authMiddleware, async (req, res) => {
  console.log("test")
  const { userId } = res.locals.user;
  const {title ,content} = req.body;
  const post = await posts.create({
    userId : userId,
    title,
    content,
  })

  return res.status(201).json({ data: post });
});

router.get("/posts", async (req, res) => {
    const post = await posts.findAll({
      attributes: ['title', 'content', 'createdAt'],
      include: [
        {
          model: users,
          attributes: ['nickname'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ data: post });
  });

router.get("/posts/:_postId", (req, res) => {
    res.send("goods.js about PATH");
  });


router.put("/posts/:postId", (req, res) => {
    
    res.send("goods.js about PATH");
  });

router.delete("/posts/:postId", (req, res) => {
    res.send("goods.js about PATH");
  });

  module.exports = router