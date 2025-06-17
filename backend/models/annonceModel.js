const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema({
  conducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  depart: String,
  etapes: String,
  destination: String,
  dateTrajet: Date,
  dimensions: String,
  typeMarchandise: String,
  capaciteDisponible: Number,
}, { timestamps: true });

module.exports = mongoose.model("Annonce", annonceSchema);
