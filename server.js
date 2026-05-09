require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const User = require("./models/User");
const Customer = require("./models/Customer");

const app = express();

const PORT = process.env.PORT || 10000;

/* =========================
   CREATE UPLOADS
========================= */

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

/* FIXED UPLOADS ROUTE */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =========================
   DATABASE
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

/* =========================
   FILE UPLOAD
========================= */

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  },

});

const upload = multer({ storage });

/* =========================
   REGISTER
========================= */

app.post("/register", async (req, res) => {

  try {

    const { email, password } = req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {

      return res.json({
        success: false,
        message: "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({

      email,

      password: hashedPassword,

    });

    await user.save();

    res.json({

      success: true,

      message: "Registered Successfully",

    });

  } catch (err) {

    console.log(err);

    res.json({

      success: false,

      message: "Register Error",

    });

  }

});

/* =========================
   LOGIN
========================= */

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.json({

        success: false,

        message: "Invalid Credentials",

      });

    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {

      return res.json({

        success: false,

        message: "Invalid Credentials",

      });

    }

    const token = jwt.sign(

      {
        id: user._id,
      },

      process.env.JWT_SECRET

    );

    res.json({

      success: true,

      token,

    });

  } catch (err) {

    console.log(err);

    res.json({

      success: false,

      message: "Login Error",

    });

  }

});

/* =========================
   SAVE CUSTOMER
========================= */

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

      let media = "";

      if (req.file) {

        media =
          "/uploads/" +
          req.file.filename;

      }

      const customer = new Customer({

        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        description,
        media,

      });

      await customer.save();

      res.json({

        success: true,

        message: "Customer Saved",

      });

    } catch (err) {

      console.log(err);

      res.json({

        success: false,

        message: "Save Error",

      });

    }

  }

);

/* =========================
   GET CUSTOMERS
========================= */

app.get("/customers", async (req, res) => {

  try {

    const customers =
      await Customer.find().sort({
        createdAt: -1,
      });

    res.json(customers);

  } catch (err) {

    console.log(err);

    res.json([]);

  }

});

/* =========================
   DELETE CUSTOMER
========================= */

app.delete(

  "/delete-customer/:id",

  async (req, res) => {

    try {

      const customer =
        await Customer.findById(
          req.params.id
        );

      if (!customer) {

        return res.json({
          success: false,
        });

      }

      if (customer.media) {

        const fileName =
          customer.media.replace(
            "/uploads/",
            ""
          );

        const filePath =
          path.join(
            __dirname,
            "uploads",
            fileName
          );

        if (fs.existsSync(filePath)) {

          fs.unlinkSync(filePath);

        }

      }

      await Customer.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
      });

    } catch (err) {

      console.log(err);

      res.json({
        success: false,
      });

    }

  }

);

/* =========================
   SEND EMAIL
========================= */

app.post("/send-email", async (req, res) => {

  try {

    const { to, subject, text } =
      req.body;

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {

          user:
            process.env.EMAIL_USER,

          pass:
            process.env.EMAIL_PASS,

        },

      });

    await transporter.sendMail({

      from:
        process.env.EMAIL_USER,

      to,
      subject,
      text,

    });

    res.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    res.json({
      success: false,
    });

  }

});

/* =========================
   DEFAULT
========================= */

app.get("/", (req, res) => {

  res.sendFile(

    path.join(
      __dirname,
      "public/login.html"
    )

  );

});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});