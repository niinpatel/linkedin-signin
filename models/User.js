const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  linkedinId: String,
  name: String,
  email: String,
  headline: String,
  location: String
});

module.exports = mongoose.model("User", userSchema);
