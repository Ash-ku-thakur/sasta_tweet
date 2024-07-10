// if we want to get req.body.id then we have to use method :post

import express from "express";
import { databaseConnection } from "./utils/database.js";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import router from "./routerts/userRouter.js";
import cors from "cors";
import tweetRouter from "./routerts/tweetRouter.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: ".env",
});

let app = express();

databaseConnection();

// cors setUp
let corsOption = {
  // origin: "http://localhost:5173/",
  origin: true,
  // methods: ["GET", "POST", "PUT", "DELETE", "UPDATE", "PATCH"],
  credentials: true,
};

// midelwere
app.use("*", cors(corsOption));
// app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, process.env.PUBLIC_DIR)));
app.use(true, (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// routers
app.use("/api/v1/user", router);
app.use("/api/v1/tweet", tweetRouter);

app.listen(process.env.PORT, (req, res) => {
  console.log("server started on 8082 PORT");
});
