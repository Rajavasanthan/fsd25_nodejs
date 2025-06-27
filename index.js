const express = require("express");
const app = express();
const { connect } = require("./db_config");
const { Product } = require("./Product_Schema");
const cors = require("cors");
const dotenv = require("dotenv").config()
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

app.listen(process.env.PORT || 3000, () => {
  console.log("Webserver running");
});
