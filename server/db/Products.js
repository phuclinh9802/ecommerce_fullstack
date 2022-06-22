const mongoose = require("mongoose");
const uuid = require("uuid");

const Schema = mongoose.Schema;
// Create Schema
const ProductSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  rating: {
    type: Number
  }

});

module.exports = User = mongoose.model("products", ProductSchema);