import { app } from "./app";
require("dotenv").config();
import { v2 as cloudinary } from "cloudinary";

//db connection
const connection = require("./utils/db");

//const port = process.env.PORT || 8000;

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//create server
app.listen(process.env.PORT, () => {
  console.log(`app is on port ${process.env.PORT}`);
  connection;
});
