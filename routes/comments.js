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
  if(!userId)
  {
    return res.status(403).json({ "errorMessage" : "로그인이 필요한 기능입니다." });
  }
  const { postsId } = req.params;
  const {comment} = req.body;
  const commentPost = await comments.create({
    userid : userId,
    postid : postsId,
    comment,
  })

  if(comment==null)
  {
    return res.status(412).json({ "errorMessage" : "댓글 형식이 일치하지 않습니다." });
  }

  if(postsId==null)
  {
    return res.status(412).json({ "errorMessage" : "게시글이 존재하지 않습니다." });
  }

  if(!commentPost)
  {
    return res.status(412).json({ "errorMessage" : "데이터 형식이 일치하지 않습니다." });
  }
  else{
    return res.status(201).json({ "Message" : "댓글 작성 성공하였습니다." });
  }
});

router.get("/comments/:postsId",async (req, res) => {
    const {postsId} = req.params;
    if(postsId==null)
    {
      return res.status(412).json({ "errorMessage" : "게시글이 존재하지 않습니다." });
    }
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
    if(!comment)
    {
      return res.status(412).json({ "errorMessage" : "댓글이 존재하지 않습니다." });
    }
    else{
      return res.status(200).json({ data: comment });
    }
  });

router.put("/comments/:commentId", authMiddleware ,async(req, res) => {

  const { commentId } = req.params;
  const { userId } = res.locals.user;
  if(!userId)
  {
    return res.status(403).json({ "errorMessage" : "로그인이 필요한 기능입니다." });
  }
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

  if(!posts)
  {
    return res.status(404).json({ message: "데이터 형식이 잘못되었습니다." });
  }
  else{
    return res.status(200).json({ data: "게시글이 수정되었습니다." });
  }
});

  router.delete("/comments/:commentId",authMiddleware,async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals.user;

    if(!userId)
    {
      return res.status(403).json({ "errorMessage" : "로그인이 필요한 기능입니다." });
    }

    const commentsdel = await comments.findOne({ where: { commentId } });

    if (!commentsdel) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    } else if (commentsdel.userid !== userId) {
      return res.status(401).json({ message: "권한이 없습니다." });
    }

    await commentsdel.destroy({
      where: {
        [Op.and]: [{ commentId }, { userid: userId }],
      }
    });

    return res.status(200).json({ data: "게시글이 삭제되었습니다." });
    });

    function checkSpecial(str) { 
      const regExp = /[!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]/g;
      if(regExp.test(str)) {
          return true;
      }else{
          return false;
      } 
    } 
  
    function checkSpace(str) { 
      if(str.search(/\s/) !== -1) {
          return true; // 스페이스가 있는 경우
      }else{
          return false; // 스페이스 없는 경우
      }
    } 

module.exports = router