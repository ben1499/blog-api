const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author_name: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true }
})

CommentSchema.virtual("timestamp_formatted").get(function() {
  const dateTime = DateTime.fromMillis(this.timestamp);
  return dateTime.toFormat("dd-LL-yyyy HH:mm:ss");
})

module.exports = mongoose.model("Comment", CommentSchema);