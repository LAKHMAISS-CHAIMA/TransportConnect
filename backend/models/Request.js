const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  expediteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  itemDescription: { type: String, required: true },
  weight: { type: Number },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  status: {
    type: String,
    enum: ["en_attente", "accepte", "refuse", "livre"],
    default: "en_attente",
  },
  priceOffered: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
