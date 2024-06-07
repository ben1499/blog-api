const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.signup = [
  body("username")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Username must be specified"),
  body("password")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Password must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    } else {
      bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
        const user = new User({
          username: req.body.username,
          password: hashedPassword
        })

        await user.save();
        res.status(200).json({ message: "User created successfully" })
      })
    }
  })
]

exports.login = [
  body("username")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Username must be specified"),
  body("password")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Password must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

    } else {
      const user = await User.findOne({ username: req.body.username }).exec();

      if (!user) {
        return res.status(400).json({ message: `User not found with username ${req.body.username}` })
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Password is incorrect" });
      }
      console.log("hello");
      jwt.sign({ user: req.body.username }, process.env.JWT_SECRET, (err, token) => {
        res.status(200).json({ token });
      })
    }
  })
]