const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(

  {

    firstName: {

      type: String,

      required: true

    },

    lastName: {

      type: String,

      required: true

    },

    phone: {

      type: String,

      default: ""

    },

    email: {

      type: String,

      default: ""

    },

    address: {

      type: String,

      default: ""

    },

    city: {

      type: String,

      default: ""

    },

    description: {

      type: String,

      default: ""

    },

    media: [

      {

        type: String

      }

    ],

    userId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true

    }

  },

  {

    timestamps: true

  }

);

module.exports = mongoose.model(

  "Customer",

  customerSchema

);