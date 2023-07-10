const express = require('express');
const router = express.Router();

const comments = require("../models");
const index = require("../models")
const posts = require("../models");
const authMiddleware = require('../middleware/authMiddleware');

// localhost:3000/api/about GET
router.post("/posts",authMiddleware, async (req, res) => {
  // console.log("test")
  // const { userId } = res.locals.user;
  // const {title ,content} = req.body;
  // const post = await posts.create({
  //   userId : userId,
  //   title,
  //   content,
  // })

  // return res.status(201).json({ data: post });
});

router.get("/posts", (req, res) => {
    res.send("goods.js about PATH");
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