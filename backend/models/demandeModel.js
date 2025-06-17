const mongoose = require("mongoose");

const demandeSchema = new mongoose.Schema({
  annonce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Annonce",
    required: true,
  },
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: String,
  statut: {
    type: String,
    enum: ["en attente", "acceptée", "refusée"],
    default: "en attente"
  }
}, { timestamps: true });

module.exports = mongoose.model("Demande", demandeSchema);
