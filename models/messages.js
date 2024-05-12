const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  author: {
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
  },
  chatRoom: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true},
  dateCreated: { type: Date, default: Date.now },
  message: { type: String, required: true },
  prevMessages: [{
    message: { type: String },
    dateCreated: { type: Date },
  }],
  visible: { type: Boolean, required: true, default: true },
  type: {
    type: String,
    required: true,
    enum: ["text", "link", "media"],
    default: "text",
  }
});

module.exports = mongoose.model("Message", MessageSchema);
