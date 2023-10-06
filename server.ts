import { app } from "./app";
require("dotenv").config();

//db connection
const connection = require("./utils/db");

//const port = process.env.PORT || 8000;

//create server
app.listen(process.env.PORT, () => {
  console.log(`app is on port ${process.env.PORT}`);
  connection;
});
