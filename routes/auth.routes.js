const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();

//Signup route
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: passwordHash,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (passwordCorrect) {
        const payload = {
          user,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({
          user,
          token,
        });
      } else {
        res.status(401).json({ message: "Email or password is incorrect" });
      }
    } else {
      res.status(401).json({ message: "Email or password is incorrect" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
