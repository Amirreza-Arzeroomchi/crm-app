const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  description: String
});

module.exports = mongoose.model("Customer", customerSchema);