require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const User = require("./models/User");
const Customer = require("./models/Customer");

const app = express();

const PORT = process.env.PORT || 10000;

/* =========================================
   CREATE UPLOADS FOLDER
========================================= */

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* =========================================
   MIDDLEWARE
========================================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
   MULTER
========================================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/* =========================================
   AUTH
========================================= */

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "Registered Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Register Error",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      message: "Login Success",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Login Error",
    });
  }
});

/* =========================================
   SAVE CUSTOMER
========================================= */

app.post(
  "/save-customer",
  upload.single("media"),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        description,
      } = req.body;

      let mediaPath = "";

      if (req.file) {
        mediaPath = "/uploads/" + req.file.filename;
      }

      const customer = new Customer({
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        description,
        media: mediaPath,
      });

      await customer.save();

      res.json({
        success: true,
        message: "Customer Saved",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Save Error",
      });
    }
  }
);

/* =========================================
   GET CUSTOMERS
========================================= */

app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    res.json(customers);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Fetch Error",
    });
  }
});

/* =========================================
   DELETE CUSTOMER
========================================= */

app.delete("/customer/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    if (customer.media) {
      const filePath = path.join(
        __dirname,
        customer.media
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Customer Deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Delete Error",
    });
  }
});

/* =========================================
   DEFAULT ROUTES
========================================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});

/* =========================================
   404
========================================= */

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

/* =========================================
   SERVER
========================================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});