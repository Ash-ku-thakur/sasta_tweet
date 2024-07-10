import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

export let Auth = async (req, res, next) => {
  try {
    let token = req.cookies.uid;

    // basic validation

    if (!token) {
      return res.status(401).json({
        massage:"you are not authentecated",
        success:false
      })
    }

    let decode = await jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (error) {
    console.log(error);
  }
};


