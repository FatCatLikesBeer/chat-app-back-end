const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, require: true }
  }],
  dateCreated: { type: Date, default: Date.now },
  privacy: {
    type: String,
    required: true,
    enum: ["public", "related", "private"],
    default: "private",
  }
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
