const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

  firstName: String,

  lastName: String,

  phone: String,

  email: String,

  address: String,

  city: String,

  description: String,

  files: [

    {
      fileName: String,
      filePath: String,
      fileType: String
    }

  ],

  createdAt: {

    type: Date,

    default: Date.now

  }

});

module.exports =
mongoose.model(
  "Customer",
  customerSchema
);