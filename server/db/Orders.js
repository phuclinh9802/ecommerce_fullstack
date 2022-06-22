const mongoose = require("mongoose");
const uuid = require("uuid");

const Schema = mongoose.Schema;
// Create Schema
const OrderSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4
  },
  status: {
    type: String,
    required: true
  },
  isPaid: {
    type: String,
    required: true
  },
  dateShipped: {
    type: Date,
  },
  dateOrdered: {
    type: Date,
    default: Date.now
  },
  address: {
    type: String,
  },
  city: {
    type: String
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
  users: [
    { type: Schema.Types.ObjectId, ref: 'users' }
  ]

});

UserSchema.path('_id');
module.exports = User = mongoose.model("orders", OrderSchema);