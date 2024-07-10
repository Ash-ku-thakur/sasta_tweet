import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({
  path:"../.env"
})

export let databaseConnection = async (req, res) => {
  try {
    let dbConnection = await mongoose.connect(process.env.MONGO_URI);

    if (!dbConnection) {
      console.log("dbConnection failed");
    }
    console.log("dbConnection successFully");
  } catch (error) {
    console.log("dbConnection failed");
  }
};
