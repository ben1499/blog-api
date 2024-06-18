const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");

exports.post_list = asyncHandler(async (req, res, next) => {
  const { is_published } = req.query;

  let query = {};

  if (is_published !== undefined) {
    query = { is_published: JSON.parse(is_published) }
  }

  const allPosts = await Post.find(query).exec();
  if (allPosts) {
    const posts = allPosts.map((post) => {
      return {
        ...post.toObject(),
        timestamp_formatted: post.timestamp_formatted
      }
    })
    res.status(200).json({ data: posts });
  }
})

exports.post_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404).json({ error: "Post not found" });
  } else {
    res.status(200).json({ data: {
      ...post.toObject(),
      timestamp_formatted: post.timestamp_formatted
    } })
  }
})

exports.post_create = [
  verifyToken,
  body("title")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Title must be specified"),
  body("content")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Content must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    } else {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        is_published: req.body.is_published,
        timestamp: Date.now()
      })

      await post.save();
      res.status(200).json({ message: "Post created successfully" })
    }
  })
]

exports.post_update = [
  verifyToken,

  body("title")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Title must be specified"),
  body("content")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Content must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    } else {
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        is_published: req.body.is_published,
        timestamp: Date.now(),
        _id: req.params.id
      })

      const updatedPost = await Post.findByIdAndUpdate(req.params.id, post, {});
      if (!updatedPost) {
        res.status(404).json({ error: "Post not found" });
      } else {
        res.status(200).json({ message: "Post updated successfully" })
      }
    }
  })
]

exports.post_delete = [
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(200).json({ message: "Post deleted successfully" });
    }
  })
]

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        next();
      }
    })
  } else {
    res.sendStatus(403);
  }
}

