const User = require("../models/User");

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

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 

    const { firstname, lastname, phone, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstname,
          lastname,
          phone,
          email,
        },
      },
      { new: true } 
    ).select("-password"); 

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateUser,
};
