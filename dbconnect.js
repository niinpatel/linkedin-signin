const mongoose = require("mongoose");
const { mongoUri } = require("./config/config");

module.exports = mongoose.connect(
  mongoUri,
  { useNewUrlParser: true },
  err => {
    if (err) throw err;
    console.log("Connected to Database");
  }
);
