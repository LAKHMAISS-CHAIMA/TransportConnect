const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendNotification = require('../utils/sendNotification');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const user = new User({ name, email, password, role });
    const savedUser = await user.save();

    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await sendNotification(
          admin._id,
          'admin',
          `Nouvel utilisateur inscrit: ${savedUser.name} (${savedUser.email})`
        );
      }
    } catch (notifError) {
      console.error("Erreur lors de l'envoi de la notification aux admins:", notifError);
    }

    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: savedUser });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email incorrect." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect." });

    if (user.isBanned) return res.status(403).json({ message: "Compte suspendu." });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: "Déconnecté avec succès." });
};
