const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//middlewares
const validate = require("../middlewares/validate.middleware");
const { body } = require("express-validator");
const { authenticate } = require("../middlewares/jwt.middleware");

//model
const User = require("../models/User.model");

const router = express.Router();

//Signup route
router.post(
  "/signup",
  validate([
    body("firstName").isLength({ min: 2 }),
    body("lastName").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ]),
  async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    try {
      console.log(req.body)
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
  }
);

//Login route
router.post(
  "/login",
  validate([body("email").isEmail(), body("password").isLength({ min: 6 })]),
  async (req, res) => {
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
  }
);

//route to verify token
router.get("/verify", authenticate, (req, res) => {
  try {
    res.status(200).json({
      user: req.jwtPayload.user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
