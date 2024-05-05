const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  privacy: {
    type: String,
    required: true,
    enum: ["public", "related", "private"],
    default: "public",
  }
});

module.exports = mongoose.model("User", UserSchema);
