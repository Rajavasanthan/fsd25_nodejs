const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
  },
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  }
});

const Product = mongoose.model("Product", ProductSchema);
// console.log(mongoose)
module.exports = { Product };
