const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

const PORT = process.env.PORT || 10000;

/* =========================================
   MONGODB
========================================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

/* =========================================
   USER MODEL
========================================= */

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

/* =========================================
   CUSTOMER MODEL
========================================= */

const customerSchema = new mongoose.Schema({

  firstName: String,

  lastName: String,

  phone: String,

  email: String,

  address: String,

  city: String,

  description: String,

  media: [String]

});

const Customer = mongoose.model(
  "Customer",
  customerSchema
);

/* =========================================
   MULTER
========================================= */

if (!fs.existsSync("./public/uploads")) {

  fs.mkdirSync(
    "./public/uploads",
    { recursive: true }
  );

}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "./public/uploads");

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});

const upload = multer({
  storage
});

/* =========================================
   REGISTER
========================================= */

app.post("/register", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const user =
      new User({
        email,
        password
      });

    await user.save();

    res.json({
      message: "Registered Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Register Error"
    });

  }

});

/* =========================================
   LOGIN
========================================= */

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email,
        password
      });

    if (!user) {

      return res.status(400).json({
        message: "Invalid Credentials"
      });

    }

    res.json({
      message: "Login Success"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Login Error"
    });

  }

});

/* =========================================
   ADD CUSTOMER
========================================= */

app.post(
  "/add-customer",
  upload.array("media"),
  async (req, res) => {

    try {

      const {

        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        description

      } = req.body;

      const media =
        req.files?.map(file => {

          return "/uploads/" + file.filename;

        }) || [];

      const customer =
        new Customer({

          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          description,
          media

        });

      await customer.save();

      res.json({
        message: "Customer Saved"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Save Error"
      });

    }

  }
);

/* =========================================
   GET CUSTOMERS
========================================= */

app.get("/customers", async (req, res) => {

  try {

    const customers =
      await Customer.find().sort({
        _id: -1
      });

    res.json(customers);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Fetch Error"
    });

  }

});

/* =========================================
   DELETE CUSTOMER
========================================= */

app.delete(
  "/delete-customer/:id",
  async (req, res) => {

    try {

      await Customer.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Deleted"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Delete Error"
      });

    }

  }
);

/* =========================================
   HOME
========================================= */

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public/login.html"
    )
  );

});

/* =========================================
   SERVER
========================================= */

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});