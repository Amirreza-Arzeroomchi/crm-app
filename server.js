const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const User = require("./models/User");
const Customer = require("./models/Customer");

const app = express();

const PORT = process.env.PORT || 3000;


// =========================
// MONGODB CONNECT
// =========================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


// =========================
// HOME PAGE
// =========================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


// =========================
// REGISTER USER
// =========================

app.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "Email Already Exists"
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
      message: "User Registered Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Register Error"
    });

  }

});


// =========================
// LOGIN USER
// =========================

app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "User Not Found"
      });

    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {

      return res.status(400).json({
        message: "Wrong Password"
      });

    }

    const token = jwt.sign(
      { id: user._id },
      "secretkey"
    );

    res.json({
      message: "Login Success",
      token
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Login Error"
    });

  }

});


// =========================
// SAVE CUSTOMER
// =========================

app.post("/save", async (req, res) => {

  try {

    const token = req.headers.authorization;

    if (!token) {

      return res.status(401).send("No Token");

    }

    const decoded = jwt.verify(token, "secretkey");

    const customer = new Customer({

      ...req.body,

      userId: decoded.id

    });

    await customer.save();

    res.send("Customer Saved");

  } catch (err) {

    console.log(err);

    res.status(500).send("Error Saving Customer");

  }

});


// =========================
// GET CUSTOMERS
// =========================

app.get("/customers", async (req, res) => {

  try {

    const customers = await Customer.find();

    res.json(customers);

  } catch (err) {

    console.log(err);

    res.status(500).send("Error Fetching Customers");

  }

});


// =========================
// DELETE CUSTOMER
// =========================

const dataFile = path.join(__dirname, "public", "data.json");

app.delete("/delete/:index", (req, res) => {

  let data = JSON.parse(fs.readFileSync(dataFile));

  const index = req.params.index;

  data.splice(index, 1);

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.send("Deleted");

});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});