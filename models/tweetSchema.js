import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    createdBy: String,
    likedBy: {
      type: [String],
    },
    bookmarkedBy: {
      type: [String],
    },
    userdetails: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

let Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;
