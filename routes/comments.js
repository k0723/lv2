const express = require('express');
const router = express.Router();

const {comments} = require("../models");
const {index} = require("../models")
const {posts} = require("../models")

// localhost:3000/api/about GET
router.post("/comments/:_postsId", (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;
  
    res.json({ result: "success" });
});

router.get("/comments/:_postsId", (req, res) => {
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