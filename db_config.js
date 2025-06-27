const mongoose = require("mongoose");

async function connect() {
  await mongoose.connect(process.env.DB);
}

module.exports = { connect };