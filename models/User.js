const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  linkedinId: String,
  name: String,
  email: String,
  headline: String,
  location: String,
  summary: String,
  linkedinProfileURL: String
});

module.exports = mongoose.model("User", userSchema);
