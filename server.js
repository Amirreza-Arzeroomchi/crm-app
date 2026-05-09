app.post("/save", async (req, res) => {

  try {

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "No Token"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const newCustomer = new Customer({

      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      description: req.body.description,

      userId: decoded.id

    });

    await newCustomer.save();

    res.status(201).json({
      message: "Customer Saved Successfully"
    });

  } catch (err) {

    console.log("SAVE CUSTOMER ERROR:", err);

    res.status(500).json({
      message: "Save Customer Error"
    });

  }

});