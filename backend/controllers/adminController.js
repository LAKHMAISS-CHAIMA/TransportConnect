const User = require("../models/User");
const Annonce = require("../models/annonceModel");
const Demande = require("../models/demandeModel");

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
    const annonces = await Annonce.find().populate("conducteur", "name");
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

exports.getAllDemandes = async (req, res) => {
  try {
    const demandes = await Demande.find()
      .populate('expediteur', 'name email')
      .populate({
        path: 'annonce',
        select: 'depart destination',
        populate: {
          path: 'conducteur',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const annonces = await Annonce.countDocuments();
    const totalDemandes = await Demande.countDocuments();
    const acceptedDemandes = await Demande.countDocuments({ statut: 'acceptée' });

    const acceptanceRate = totalDemandes > 0 ? (acceptedDemandes / totalDemandes) * 100 : 0;

    res.json({ users, annonces, demandes: totalDemandes, acceptanceRate });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getGraphStats = async (req, res) => {
  try {
    const usersByMonth = await User.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const annoncesByMonth = await Annonce.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({ usersByMonth, annoncesByMonth });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des données de graphique.", error: error.message });
  }
};
