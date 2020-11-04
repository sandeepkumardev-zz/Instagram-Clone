const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
});

router.post("/signup", (req, res) => {
  const { username, email, password, pic } = req.body;
  if (!username || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(400)
          .json({ error: "User already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          username,
          email,
          password: hashedpassword,
          pic,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Sign up successfully !" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(400).json({ error: "Invalid Email ID or Password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((domatch) => {
        if (domatch) {
          //   res.json({ message: "Successfully Login" });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { id, username, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { id, username, email, followers, following, pic },
          });
        } else {
          return res
            .status(400)
            .json({ message: "Invalid Email ID or Password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
