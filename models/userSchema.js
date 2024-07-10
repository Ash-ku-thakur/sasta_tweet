import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    userName: String,
    email: String,
    password: String,
    tweets: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    followers: {
      type: [String],
      default: [],
    },
    bookmarks: {
      type: [String],
      default: [],
    },
    tweetsLike: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

let User = mongoose.model("User", userSchema);
export default User;
