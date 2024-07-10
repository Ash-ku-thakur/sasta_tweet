import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({
  path: "../env",
});

// Create a user
export let Register = async (req, res) => {
  try {
    let { name, userName, email, password } = req.body;

    //    basic validation
    if (!name || !userName || !email || !password) {
      return res.status(401).json({
        massage: "All field are required",
        success: false,
      });
    }

    // check it is already present or not
    let userPresentOrNot = await User.findOne({ email });

    if (userPresentOrNot) {
      return res.status(404).json({
        massage: "This email is already exist",
        success: false,
      });
    }

    // doet use plain password

    let hashPassword = await bcrypt.hash(password, 10);

    let createdUser = await User.create({
      name,
      userName,
      email,
      password: hashPassword,
    });

    let token = await jwt.sign(
      { userId: createdUser.password },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(201).cookie("uid", token).json({
      massage: "User created successfully",
      success: true,
      createdUser,
    });
  } catch (error) {
    console.log(error);
  }
};

// login a user
export let Login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(401).json({
        massage: "email & password are required",
        success: false,
      });
    }

    // user present or not checking by email
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        massage: "email or password is inCorrect",
        success: false,
      });
    }

    // real user present or not checking by password
    let isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(401).json({
        massage: "email or password is inCorrect",
        success: false,
      });
    }

    let token = await jwt.sign(
      { userId: user.password },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res
      .status(201)
      .cookie("uid", token, { expiresIn: "1d" })
      .json({
        massage: `welcome back ${user.name} cookie is seted by backend`,
        success: true,
        createdUser: user,
      });
  } catch (error) {
    console.log(error);
  }
};

// logout a user
export let Logout = async (req, res) => {
  try {
    // let token = req.cookies.uid;
    // if (!token) {
    //   return res.status(401).json({
    //     massage: "you are not loggedin",
    //     success: false,
    //   });
    // }

    return res.status(201).cookie("uid", "").json({
      massage: "user loggedOut Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// get Profile
export let Profile = async (req, res) => {
  try {
    let loggedinUserId = req.params.id;

    // basic validation
    if (!loggedinUserId || undefined) {
      return res.status(401).json({
        massage: "pass the user id",
        success: false,
      });
    }

    let user = await User.findById(loggedinUserId);

    //  basic validation
    if (!user) {
      return res.status(401).json({
        massage: "user cann't find by this id",
        success: false,
      });
    }

    return res.status(201).json({
      massage: "find user profile successfully",
      success: true,
      userProfile: user,
    });
  } catch (error) {
    console.log(error);
  }
};

// other users (except me)
export let OtherUser = async (req, res) => {
  try {
    let loggedinUserId = req.params.id;

    // basic validation
    if (!loggedinUserId) {
      return res.status(401).json({
        massage: "send the loggedinUserId",
        success: false,
      });
    }

    let otherUser = await User.find({
      _id: { $ne: { _id: loggedinUserId } },
    });
    // console.log(otherUser);
    return res.json({
      otherUser,
    });
  } catch (error) {
    console.log(error);
  }
};

// following users
export let FollowUsers = async (req, res) => {
  try {
    let loggedinUserId = req.body.id;
    let followingUserId = req.params.id;

    if (!loggedinUserId || !followingUserId) {
      return res.status(401).json({
        massage: "All fiels are required",
        success: false,
      });
    }

    // find the loggedinUser
    let user = await User.findById(loggedinUserId);
    let followingUsers = await User.findById(followingUserId);

    if (!user) {
      return res.status(401).json({
        massage: "user cann't find",
        success: false,
      });
    }

    if (!user.following.includes(followingUserId)) {
      // follow
      await User.findByIdAndUpdate(loggedinUserId, {
        $push: { following: followingUserId },
      });

      await User.findByIdAndUpdate(followingUsers, {
        $push: { followers: loggedinUserId },
      });
    } else {
      // nikaal do
      await User.findByIdAndUpdate(loggedinUserId, {
        $pull: { following: followingUserId },
      });

      await User.findByIdAndUpdate(followingUsers, {
        $pull: { followers: loggedinUserId },
      });
    }

    return res.status(201).json({
      massage: `${user.name} just follow ${followingUsers.name}`,
      success: true,
      createdUser: followingUsers,
    });
  } catch (error) {
    console.log(error);
  }
};
