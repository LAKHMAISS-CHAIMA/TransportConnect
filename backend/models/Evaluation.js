const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  conducteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trajet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Annonce",
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);
