const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  conducteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  departure: { type: String, required: true },
  steps: [{ type: String }], 
  destination: { type: String, required: true },
  transportType: { type: String, enum: ["camion", "voiture", "moto", "autre"], required: true },
  maxWeight: { type: Number },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  price: { type: Number },
  departureDate: { type: Date, required: true },
  available: { type: Boolean, default: true },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
