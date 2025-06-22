const User = require("../models/User");
const sendNotification = require("../utils/sendNotification");
const Annonce = require('../models/annonceModel');
const Demande = require('../models/demandeModel');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profil mis à jour avec succès.",
      user: { 
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        noteMoyenne: updatedUser.noteMoyenne
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const validateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    await sendNotification(user._id, "admin", "Votre compte a été validé par l'administrateur.");
    res.json({ message: "Utilisateur validé", user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "suspended" }, { new: true });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    await sendNotification(user._id, "admin", "Votre compte a été suspendu par l'administrateur.");
    res.json({ message: "Utilisateur suspendu", user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'conducteur') {
      const annoncesCount = await Annonce.countDocuments({ conducteur: userId });
      const trajetsEffectues = await Demande.countDocuments({ 
        'annonce.conducteur': userId,
        statut: 'acceptée' 
      });
      
      const userAnnonces = await Annonce.find({ conducteur: userId }).select('_id');
      const annonceIds = userAnnonces.map(a => a._id);

      stats.annonces = annoncesCount;
      stats.trajets = await Demande.countDocuments({ annonce: { $in: annonceIds }, statut: 'acceptée' });

    } else if (userRole === 'expediteur') {
      const demandesCount = await Demande.countDocuments({ expediteur: userId });
      const trajetsTermines = await Demande.countDocuments({ expediteur: userId, statut: 'acceptée' });
      stats.demandes = demandesCount;
      stats.trajets = trajetsTermines;
    }

    res.json(stats);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {getProfile, updateProfile, getAllUsers, validateUser, suspendUser, deleteUser, getUserStats};
