const Evaluation = require("../models/Evaluation");

const laisserEvaluation = async (req, res) => {
  try {
    const { conducteur, trajet, note, commentaire } = req.body;

    const existe = await Evaluation.findOne({
      expediteur: req.user.id,
      trajet
    });

    if (existe) {
      return res.status(400).json({ message: "Vous avez déjà évalué ce trajet." });
    }

    const nouvelleEvaluation = new Evaluation({
      expediteur: req.user.id,
      conducteur,
      trajet,
      note,
      commentaire
    });

    await nouvelleEvaluation.save();

    res.status(201).json({ message: "Évaluation ajoutée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
