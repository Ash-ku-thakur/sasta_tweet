import express from "express";
import {
  FollowUsers,
  Login,
  Logout,
  OtherUser,
  Profile,
  Register,
} from "../controlers/userControler.js";
import { Auth } from "../utils/auth.js";

let router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login); // Auth ki jarurat yaha nahi hai  // iske basd jarurat hai
router.route("/logout").get(Logout);
router.route("/profile/:id").get(Auth, Profile);
router.route("/otherUser/:id").get(Auth, OtherUser);
router.route("/follow/:id").put(Auth, FollowUsers);

export default router;
