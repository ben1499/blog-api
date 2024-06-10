const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  is_published: { type: Boolean, required: true }
})

PostSchema.virtual("timestamp_formatted").get(function() {
  const dateTime = DateTime.fromMillis(this.timestamp);
  return dateTime.toFormat("dd-LL-yyyy HH:mm:ss");
})

module.exports = mongoose.model("Post", PostSchema);