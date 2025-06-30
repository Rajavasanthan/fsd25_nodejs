const express = require("express");
const app = express();
const { connect } = require("./db_config");
const { Product } = require("./Product_Schema");
const cors = require("cors");
const { User } = require("./User_Schema");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken")
app.use(express.json());
const JWT_KEY = "&jq]k6}'%ik6'-.X"
app.use(
  cors({
    origin: "*",
  })
);

(async () => {
  await connect();
  console.log("DB Connected");
})();

function authenticate(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Not Aloowed" })
  } else {
    try {
      const payload = jwt.verify(req.headers.authorization, JWT_KEY)
      console.log(payload)
      req.user = payload
      next()
    } catch (error) {
      return res.status(401).json({ message: "Not a valid token" })
    }
  }
}

app.post("/product", authenticate, async (req, res) => {
  try {
    console.log(req.user._id);
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

app.get("/products",authenticate, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/product/:id", authenticate,async (req, res) => {
  try {
    await Product.findOneAndUpdate({ _id: req.params.id }, req.body);
    res.json({ message: "Updated" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/product/:id",authenticate, async (req, res) => {
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
    console.log(user)
    if (user) {
      const checkPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (checkPassword) {
        const token = jwt.sign({ _id: user._id, role: "user" }, JWT_KEY, { expiresIn: '1h' })
        res.json({ message: "Correct Password", token });
      } else {
        res.status(401).json({
          message: "Incorrect Password",
        });
      }
    } else {
      res.status(401).json({ email: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error })
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Webserver running", port);
});
