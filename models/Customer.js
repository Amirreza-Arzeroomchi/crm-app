const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

  firstName: String,

  lastName: String,

  phone: String,

  email: String,

  address: String,

  city: String,

  description: String,

  media: [String],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, {

  timestamps: true

});

module.exports = mongoose.model(
  "Customer",
  customerSchema
);