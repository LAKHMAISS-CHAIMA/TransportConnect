const User = require("../models/User");
 const Annonce = require("../models/annonceModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json({ message: "Utilisateur vérifié avec succès.", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification.", error: error.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isBanned: true, status: "suspended" }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json({ message: "Utilisateur suspendu avec succès.", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suspension.", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression.", error: error.message });
  }
};

exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find().populate("conducteur", "firstname lastname");
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteAnnonce = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const annonce = await Annonce.findByIdAndDelete(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce non trouvée." });
    }
    res.json({ message: "Annonce supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'annonce.", error: error.message });
  }
};

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

    const Demande = require("../models/demandeModel");
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
