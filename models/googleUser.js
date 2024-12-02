const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const GoogleUserSchema = new Schema({
  googleID: String,
  token: String,
  email: String,
  firstName: String,
  lastName: String,
  picture: String,
});

module.exports = mongoose.model("GoogleUser", GoogleUserSchema);
