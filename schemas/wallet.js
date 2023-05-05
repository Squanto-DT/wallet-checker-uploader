const { Schema, model } = require("mongoose");

const walletSchema = new Schema({
  Address: {
    type: String,
    unique: true,
  },
  Amount: Number,
});

module.exports = model("WlWallet", walletSchema, "wlwallets");
