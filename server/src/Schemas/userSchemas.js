const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    bio: { type: String },
    profileimg: {
      type: String,
    },

    fcmToken: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
