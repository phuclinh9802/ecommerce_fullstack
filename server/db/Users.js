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
  isSocial: {
    type: Boolean,
    default: false
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
    type: String,
  },
  country: {
    type: String,
  },
  billAddress: {
    type: String,
    required: true,
  },
  billCity: {
    type: String,
    required: true,
  },
  billState: {
    type: String,
    required: true,
  },
  billCode: {
    type: String,
    required: true,
  },
  billCountry: {
    type: String,
    required: true,
  },
  shipAddress: {
    type: String,
    required: true,
  },
  shipCity: {
    type: String,
    required: true,
  },
  shipState: {
    type: String,
    required: true,
  },
  shipCode: {
    type: String,
    required: true,
  },
  shipCountry: {
    type: String,
    required: true,
  },
});

UserSchema.path("_id");
module.exports = User = mongoose.model("users", UserSchema);
