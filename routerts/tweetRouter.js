import express from "express";
import {
  DeleteTweet,
  GetFollowingUserTweets,
  LikeAndDislikeTweet,
  OnlyFollowingTweets,
  TweetCreate,
} from "../controlers/tweetControler.js";
import { Auth } from "../utils/auth.js";

let tweetRouter = express.Router();

tweetRouter.route("/crateTweet").post(Auth,TweetCreate);
tweetRouter.route("/getTweets/:id").get(Auth,GetFollowingUserTweets);
tweetRouter.route("/delete/:id").delete(Auth,DeleteTweet);
tweetRouter.route("/onlyFollowingTweets/:id").get(Auth,OnlyFollowingTweets);
tweetRouter.route("/like/:id").put(Auth,LikeAndDislikeTweet);

export default tweetRouter;
