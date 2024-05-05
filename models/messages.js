const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true},
  chatRoom: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true},
  dateCreated: { type: Date, default: Date.now },
  type: {
    type: String,
    required: true,
    enum: ["text", "link", "media"],
    default: "text",
  }
});

module.exports = mongoose.model("Message", MessageSchema);
