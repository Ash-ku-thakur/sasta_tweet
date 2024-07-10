import { response } from "express";
import Tweet from "../models/tweetSchema.js";
import User from "../models/userSchema.js";
import tweetRouter from "../routerts/tweetRouter.js";

// create tweet
export let TweetCreate = async (req, res) => {
  try {
    let { description, createdId } = req.body;

    // basic vaidation
    if (!description || !createdId) {
      return res.status(401).json({
        massage: "All fields are required",
        success: false,
      });
    }

    let loggedinUser = await User.findById(createdId);

    if (!loggedinUser) {
      return res.status(401).json({
        massage: "please check your Id",
        success: false,
      });
    }

    let tweetCreated = await Tweet.create({
      description,
      createdBy: createdId,
      userdetails: loggedinUser,
    });

    return res.status(201).json({
      massage: "Tweet created SuccessFully",
      success: true,
      createdUser: loggedinUser,
      tweetCreated,
    });
  } catch (error) {
    console.log(error);
  }
};

// delete tweet
export let DeleteTweet = async (req, res) => {
  try {
    let tweetId = req.params.id;

    console.log(tweetId);
    // basic validation
    if (!tweetId) {
      return res.status(401).json({
        massage: "tweetId and loggedinUserId are not provided",
        success: false,
      });
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(201).json({
      massage: "tweet delete SuccessFully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//getTweet (loggedinUser + following)
export let GetFollowingUserTweets = async (req, res) => {
  try {
    let loggedinUserId = req.params.id;

    if (!loggedinUserId) {
      return res.status(401).json({
        massage: "userId is not passed here",
        success: false,
      });
    }

    let user = await User.findById(loggedinUserId);

    if (!user) {
      return res.status(401).json({
        massage: "user is not peresent here",
        success: false,
      });
    }

    // following mse id get kar and us id se tweets get karo
    let followingUsersTweets = await Promise.all(
      user.following.map(async (get) => await Tweet.find({ createdBy: get }))
    );

    let myTweets = await Tweet.find({ createdBy: loggedinUserId });

    let allTweets = [];
    allTweets.push(...myTweets);

    // jo bhi data hoga ek ek kerke allTweets me chala jaiga
    // spread ka use is lia kia hai ki "jo data allTweets me hoga sirf usi data ke baad ye data jai"
    followingUsersTweets.forEach((tw) => {
      allTweets.push(...tw);
    });
    // who created tweet told them
    // schema struher hi kaam ker dega

    return res.status(201).json({
      allTweets,
    });
  } catch (error) {
    console.log(error);
  }
};

// only followTweets
export let OnlyFollowingTweets = async (req, res) => {
  try {
    let loggedinUserId = req.params.id;

    if (!loggedinUserId) {
      return res.status(401).json({
        massage: "userId is not passed here",
        success: false,
      });
    }

    let user = await User.findById(loggedinUserId);

    if (!user) {
      return res.status(401).json({
        massage: "user is not peresent here",
        success: false,
      });
    }

    // following mse id get kar and us id se tweets get karo
    let followingUsersTweets = await Promise.all(
      user.following.map(async (get) => await Tweet.find({ createdBy: get }))
    );

    return res.status(201).json({
      allTweets: followingUsersTweets,
    });
  } catch (error) {
    console.log(error);
  }
};

//tweet like
export let LikeAndDislikeTweet = async (req, res) => {
  try {
    let tweetId = req.params.id;
    let loggedinUserId = req.body.id;

    // basic validation
    if (!tweetId || !loggedinUserId) {
      return res.status(401).json({
        massage: "tweetId And LoggedinUserId are not provided",
        success: false,
      });
    }

    let user = await User.findById(loggedinUserId);
    let tweet = await Tweet.findById(tweetId);

    if (!tweet.likedBy.includes(loggedinUserId)) {
      // daal do
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { likedBy: loggedinUserId },
      });

      await User.findByIdAndUpdate(loggedinUserId, {
        $push: { tweetsLike: tweetId },
      });

      return res.status(201).json({
        massage: `you just like ${tweet.userdetails.name}'s tweet`,
        success: true,
      });
    } else {
      // nikaal do
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { likedBy: loggedinUserId },
      });

      await User.findByIdAndUpdate(loggedinUserId, {
        $pull: { tweetsLike: tweetId },
      });

      return res.status(201).json({
        massage: `you just unlike ${tweet.userdetails.name}'s tweet`,
        success: true,
      });
    }

   
  } catch (error) {
    console.log(error);
  }
};
