const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author_name: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true }
})

module.exports = mongoose.model("Comment", CommentSchema);