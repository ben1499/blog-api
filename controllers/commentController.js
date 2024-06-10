const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const Post = require("../models/post");
const jwt = require("jsonwebtoken")
  
exports.post_comment_list = asyncHandler(async (req, res, next) => {  
  const postComments = await Comment.find({ post_id: req.params.id }).exec();

  if (!postComments) {
    res.status(400).json({ error: "Comments not found" })
  } else {
    res.status(200).json({ data: postComments })
  }
})


exports.comment_create = [
  body("author_name")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Name must be specified"),
  body("content")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Content must be specified"),
  body("post_id")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage("Post ID must be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    } else {
      const commentPost = await Post.findById(req.body.post_id).exec();

      if (!commentPost) {
        res.status(404).json({ error: "Post not found" })
      } else {
        const comment = new Comment({
          author_name: req.body.author_name,
          content: req.body.content,
          post_id: req.body.post_id,
          timestamp: Date.now()
        })
        await comment.save();
        res.status(200).json({ message: "Comment saved successfully" })
      }
    }
  })
]

exports.comment_delete = [
  verifyToken,
  asyncHandler(async (req, res, next) => {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id).exec();

    if (!deletedComment) {
      res.status(404).json({ error: "Comment not found" });
    } else {
      res.status(200).json({ message: "Comment deleted successfully" });
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