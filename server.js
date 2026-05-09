```js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const PORT = process.env.PORT || 10000;

const User = require("./models/User");
const Customer = require("./models/Customer");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    const uploadPath = "public/uploads";

    if (!fs.existsSync(uploadPath)) {

      fs.mkdirSync(uploadPath, { recursive: true });

    }

    cb(null, uploadPath);

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});

const upload = multer({ storage });

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "login.html")
  );

});

app.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "Email already exists"
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({

      name,
      email,
      password: hashedPassword

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

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "User not found"
      });

    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {

      return res.status(400).json({
        message: "Wrong password"
      });

    }

    const token = jwt.sign(

      { id: user._id },

      process.env.JWT_SECRET,

      { expiresIn: "7d" }

    );

    res.json({

      token,
      message: "Login Success"

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Login Error"
    });

  }

});

app.post(
  "/save",
  upload.array("media"),
  async (req, res) => {

    try {

      const token = req.headers.authorization;

      if (!token) {

        return res.status(401).json({
          message: "No token"
        });

      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      let mediaFiles = [];

      if (req.files && req.files.length > 0) {

        mediaFiles = req.files.map(file => {

          return "/uploads/" + file.filename;

        });

      }

      const customer = new Customer({

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        description: req.body.description,
        media: mediaFiles,
        userId: decoded.id

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

});

app.get("/customers", async (req, res) => {

  try {

    const customers = await Customer.find();

    res.json(customers);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Fetch Error"
    });

  }

});

app.delete("/customer/:id", async (req, res) => {

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

});

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
```
