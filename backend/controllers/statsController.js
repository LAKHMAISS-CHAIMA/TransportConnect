const Annonce = require("../models/Annonce");
const Demande = require("../models/Demande");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getStats = async (req, res) => {
  try {
    const annoncesParMois = await Annonce.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const totalDemandes = await Demande.countDocuments();
    const demandesAcceptees = await Demande.countDocuments({ statut: "acceptée" });
    const tauxAcceptation = totalDemandes > 0
      ? ((demandesAcceptees / totalDemandes) * 100).toFixed(2)
      : "0";

    const trenteJours = new Date();
    trenteJours.setDate(trenteJours.getDate() - 30);

    const utilisateursAnnonces = await Annonce.distinct("conducteur", {
      createdAt: { $gte: trenteJours }
    });

    const utilisateursDemandes = await Demande.distinct("expediteur", {
      createdAt: { $gte: trenteJours }
    });

    const utilisateursActifs = new Set([...utilisateursAnnonces, ...utilisateursDemandes]);

    res.status(200).json({
      annoncesParMois,
      tauxAcceptation: `${tauxAcceptation}%`,
      utilisateursActifs: utilisateursActifs.size
    });
  } catch (error) {
    console.error("Erreur stats :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
