const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  is_published: { type: Boolean, required: true }
})

module.exports = mongoose.model("Post", PostSchema);