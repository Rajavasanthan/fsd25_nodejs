const express = require("express");
const app = express();
const { connect } = require("./db_config");
const { Product } = require("./Product_Schema");
const cors = require("cors");
const { User } = require("./User_Schema");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

(async () => {
  await connect();
  console.log("DB Connected");
})();

app.post("/product", async (req, res) => {
  try {
    console.log(req.body);
    const product = new Product(req.body);
    await product.save();
    res.json({
      message: "Product Added",
    });
  } catch (error) {
    res.status(500).json({
      message: "Eroor",
      error,
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/product/:id", async (req, res) => {
  try {
    await Product.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete({ _id: req.params.id });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    // Email, Password

    // Generate Salt
    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
      email: req.body.email,
      password: hash,
    });
    await user.save();
    res.json({ message: "User Created" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    // Find If the Email present in Database
    // If Email present then hash the password and compare it to users's hash
    // if hash is matching then make him login.

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const checkPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (checkPassword) {
        res.json({ message: "Correct Password" });
      } else {
        res.status(401).json({
          message: "Incorrect Password",
        });
      }
    } else {
      res.status(401).json({ email: "User Not Found" });
    }
  } catch (error) {}
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Webserver running", port);
});
