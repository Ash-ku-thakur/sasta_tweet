import mongoose from "mongoose";

export let databaseConnection = async (req, res) => {
  try {
    let dbConnection = await mongoose.connect(
      "mongodb://127.0.0.1:27017/tweeterTest"
    );

    if (!dbConnection) {
      console.log("dbConnection failed");
    }
    console.log("dbConnection successFully");
  } catch (error) {
    console.log("dbConnection failed");
  }
};



