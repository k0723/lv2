const express = require('express');
const router = express.Router();

const comments = require("../models");
const index = require("../models");
const users = require("../models").users;
const posts = require("../models").posts;
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require("sequelize");

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

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await posts.findOne({
    attributes: ["postId",'title', 'content', 'createdAt'],
    where : { postId }
  });
  return res.status(200).json({ data: post });
  });


router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { title, content } = req.body;
  
    const post = await posts.findOne({ where: { postId } });
  
    if (!post) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    } else if (post.userId !== userId) {
      return res.status(401).json({ message: "권한이 없습니다." });
    }
  
    await posts.update(
      { title, content }, 
      {
        where: {
          [Op.and]: [{ postId }, { userId: userId }],
        }
      }
    );
  
    return res.status(200).json({ data: "게시글이 수정되었습니다." });
  });

  router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
  
    const post = await posts.findOne({ where: { postId } });
  
    if (!post) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    } else if (post.userId !== userId) {
      return res.status(401).json({ message: "권한이 없습니다." });
    }
  
    await posts.destroy({
      where: {
        [Op.and]: [{ postId }, { userId: userId }],
      }
    });
  
    return res.status(200).json({ data: "게시글이 삭제되었습니다." });
  });
  

  module.exports = router