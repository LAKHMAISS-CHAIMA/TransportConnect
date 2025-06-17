const User = require("../models/User");

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 

    const { firstName, lastName, phone, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
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
  updateUser,
};
