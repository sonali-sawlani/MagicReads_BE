const mongoose = require("mongoose");
let { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdef", 10);

const storySchema = new mongoose.Schema({
  _id: { type: String, default: () => nanoid() },
  storyName: { type: String, required: true },
  tags: [{ type: String }],
  totalChapters: { type: Number, default: 0 },
  voteCount: { type: Number, default: 0 },
  cover: { type: String },
  genre: { type: String, required: true },
  visibility: { type: String, required: true },
  chapters: [
    { _id: { type: String, ref: "Chapter", default: () => nanoid() } },
  ],
  author: {
    username: { type: String, required: true },
    userId: { type: String, required: true },
  },
});
module.exports = mongoose.model("Story", storySchema);