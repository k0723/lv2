const express = require('express');
const router = express.Router();

const {comments} = require("../models");
const {index} = require("../models");
const {posts} = require("../models");
const {users} = require("../models");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require("sequelize");

// localhost:3000/api/about GET
router.post("/comments/:postsId",authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postsId } = req.params;
  const {comment} = req.body;
  const post = await comments.create({
    userid : userId,
    postid : postsId,
    comment,
  })

  return res.status(201).json({ data: post });
});

router.get("/comments/:postsId", (req, res) => {
    const {postsId} = req.params;
    console.log(postsId)
  
    console.log("params",params);
  
    res.status(200).json({});
    res.send("goods.js about PATH");
  });

router.get("/comments/:_commentsId", (req, res) => {
    res.send("goods.js about PATH");
  });


router.put("/comments/:_commentsId", (req, res) => {
    res.send("goods.js about PATH");
  });

router.delete("/posts/:_postId", (req, res) => {
    res.send("goods.js about PATH");
  });

module.exports = router