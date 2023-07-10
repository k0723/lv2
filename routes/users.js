const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const {users} = require("../models")

// localhost:3000/api/about GET
router.post("/signup", async (req, res) =>  {
    const { nickname, password } = req.body;
    const currentUsers = await users.findOne({ where: { nickname } });
    if (currentUsers) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }
  
    // Users 테이블에 사용자를 추가합니다.
    const user = await users.create({ nickname, password });
    // UserInfos 테이블에 사용자 정보를 추가합니다.
    return res.status(201).json({ message: "회원가입이 완료되었습니다." });

});

// 로그인
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await users.findOne({ where: { nickname } });
  if (!user) {
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  } else if (user.password !== password) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  const token = jwt.sign({
    userId: user.userId
  }, "customized_secret_key");
  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공" });
});

// router.put("/users/:userId", async (req, res) => {
//     const {nickname} = req.params;

//     const user = await users.findOne({
//       attributes: ["userId", "nickname", "createdAt", "updatedAt"],

//       where: { userId }
//     });
//     res.send("goods.js about PATH");
//   });

// router.delete("/users/:userId", (req, res) => {
//     res.send("goods.js about PATH");
//   });

  module.exports = router