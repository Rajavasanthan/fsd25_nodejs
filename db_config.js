const mongoose = require("mongoose");

async function connect() {
  await mongoose.connect("mongodb://localhost:27017/products");
}

// m6VpvjQeZGW0xyex

module.exports = { connect };