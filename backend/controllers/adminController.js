const User = require("../models/User");

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
