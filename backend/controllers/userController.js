const User = require("../models/User");
const sendNotification = require("../utils/sendNotification");

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
    const { firstname, lastname, phone, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstname,
        lastname,
        phone,
        email,
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profil mis à jour avec succès.",
      user: updatedUser,
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

module.exports = {getProfile, updateProfile, getAllUsers, validateUser, suspendUser, deleteUser};
