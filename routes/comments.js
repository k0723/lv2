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

router.get("/comments/:postsId",async (req, res) => {
    const {postsId} = req.params;
    const comment = await comments.findAll({
      attributes: ['comment', 'createdAt', 'updatedAt' ],
      include: [
        {
          model: users,
          attributes: ['nickname'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ data: comment });
  });

router.put("/comments/:commentId", authMiddleware ,async(req, res) => {

  const { commentId } = req.params;
  const { userId } = res.locals.user;
  const { comment } = req.body;

  const commentsfind = await comments.findOne({ where: { commentId } });

  if (!commentsfind) {
    return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
  } else if (commentsfind.userid !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  await posts.update(
    { comment }, 
    {
      where: {
        [Op.and]: [{ commentId}],
      }
    }
  );

  return res.status(200).json({ data: "게시글이 수정되었습니다." });
  });

router.delete("/posts/:_postId", (req, res) => {
    res.send("goods.js about PATH");
  });

module.exports = router