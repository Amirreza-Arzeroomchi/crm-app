const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

  firstName: {

    type:String,

    trim:true

  },

  lastName: {

    type:String,

    trim:true

  },

  phone: {

    type:String,

    trim:true

  },

  email: {

    type:String,

    lowercase:true,

    trim:true

  },

  address: {

    type:String,

    trim:true

  },

  city: {

    type:String,

    trim:true

  },

  description: {

    type:String,

    trim:true

  },

  userId: {

    type:mongoose.Schema.Types.ObjectId,

    ref:"User"

  }

},{
  timestamps:true
});

module.exports =
mongoose.model("Customer", customerSchema);