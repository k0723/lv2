const express = require('express');
const router = express.Router();

const comments = require("../models");
const index = require("../models");
const users = require("../models").users;
const posts = require("../models").posts;
const likes = require("../models").like;
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require("sequelize");

router.post("/posts",authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  if(!userId)
  {
    return res.status(403).json({ "errorMessage" : "로그인이 필요한 기능입니다." });
  }
  const {title ,content} = req.body;

  if(content==null)
  {
    return res.status(412).json({ "errorMessage" : "게시글 내용의 형식이 일치하지 않습니다." });
  }

  if(title==null && content==null)
  {
    return res.status(412).json({ "errorMessage" : "데이터 형식이 올바르지 않습니다." });
  }

  if(title==null)
  {
    return res.status(412).json({ "errorMessage" : "게시글 제목의 형식이 일치하지 않습니다." });
  }

  const post = await posts.create({
    userId : userId,
    title,
    content
  })
  if(!post)
  {
    return res.status(400).json({ "errorMessage" : "게시글 작성의 실패하였습니다."  });
  }

  else
  {
    return res.status(201).json({ "message": "게시글 작성에 성공하였습니다." });
  }
});

router.get("/posts", async (req, res) => {
    const post = await posts.findAll({
      attributes: ['title', 'createdAt','updatedAt'],
      include: [
        {
          model: users,
          attributes: ['nickname'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    if(!post)
    {
      return res.status(400).json({ "errorMessage" : "게시글 조회의 실패하였습니다."  });
    }
    else{
      return res.status(200).json({ data: post });
    }
  });

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await posts.findOne({
    attributes: ["postId",'title', 'content', 'createdAt'],
    where : { postId }
  });
    if(!post)
      {
        return res.status(400).json({ "errorMessage" : "게시글 상세조회의 실패하였습니다."  });
      }
    else{
        return res.status(200).json({ data: post });
    }
  });


router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { title, content } = req.body;
  
    const post = await posts.findOne({ where: { postId } });
  
    if (!post) {
      return res.status(404).json({ "message": "게시글이 존재하지 않습니다." });
    } else if (post.userId !== userId) {
      return res.status(401).json({ "message": "권한이 없습니다." });
    }
  
    await posts.update(
      { title, content }, 
      {
        where: {
          [Op.and]: [{ postId }, { userId: userId }],
        }
      }
    );
  
    return res.status(200).json({ "message": "게시글이 수정되었습니다." });
  });

  router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
  
    const post = await posts.findOne({ where: { postId } });
  
    if (!post) {
      return res.status(404).json({ "message": "게시글이 존재하지 않습니다." });
    } else if (post.userId !== userId) {
      return res.status(401).json({ "message": "권한이 없습니다." });
    }
  
    await posts.destroy({
      where: {
        [Op.and]: [{ postId }, { userId: userId }],
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

  // 좋아요 제작 하기 

  router.put("/posts/:postId/like",authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    if(!userId)
    {
      return res.status(403).json({ "errorMessage" : "로그인이 필요한 기능입니다." });
    }
  
    const post = await posts.findOne({ where: { postId } });
    const likeAdd = await posts.findOne({
      attributes: ['title', 'createdAt','updatedAt'],
    });
    if(!post)
    {
      return res.status(403).json({ "errorMessage" : "게시글이 존재하지 않습니다.." });
    }

    await posts.update(
      { like : increment}, 
      {
        where: {
          [Op.and]: [{ postId }]
        }
      }
    );

    if(!posts)
    {
      return res.status(400).json({ "errorMessage" : "좋아요 실패."  });
    }
  
    else
    {
      return res.status(201).json({ "message": "좋아요." });
    }
  });

  // 좋아요 순으로 조회 

  router.get("/posts", async (req, res) => {
    const post = await posts.findAll({
      attributes: ['title', 'createdAt','updatedAt'],
      include: [
        {
          model: users,
          attributes: ['nickname'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    if(!post)
    {
      return res.status(400).json({ "errorMessage" : "게시글 조회의 실패하였습니다."  });
    }
    else{
      return res.status(200).json({ data: post });
    }
  });

  module.exports = router