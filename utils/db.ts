const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_DB_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongo DB connection successful");
});
connection.on("error", (err: any) => {
  console.log("Mongo DB Failed");
});

module.exports = connection;
