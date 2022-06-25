const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
  },
  githubId: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: Number,
  },
  country: {
    type: String,
  },
  billAddress: {
    type: String,
  },
  billCity: {
    type: String,
  },
  billCode: {
    type: Number,
  },
  billCountry: {
    type: String,
  },
  shipAddress: {
    type: String,
  },
  shipCity: {
    type: String,
  },
  shipCode: {
    type: Number,
  },
  shipCountry: {
    type: String,
  },
});

UserSchema.path("_id");
module.exports = User = mongoose.model("users", UserSchema);
