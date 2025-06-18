const Evaluation = require("../models/Evaluation");
const User = require("../models/User");

exports.creerEvaluation = async (req, res) => {
  try {
    const { utilisateurEvalueId, annonceId, note, commentaire } = req.body;
    const evaluateurId = req.user.id;

    if (evaluateurId === utilisateurEvalueId) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous évaluer vous-même." });
    }

    const dejaEvalue = await Evaluation.findOne({
      evaluateur: evaluateurId,
      utilisateurEvalue: utilisateurEvalueId,
      annonce: annonceId,
    });

    if (dejaEvalue) {
      return res.status(400).json({ message: "Vous avez déjà évalué cet utilisateur pour cette annonce." });
    }

    const nouvelleEvaluation = await Evaluation.create({
      evaluateur: evaluateurId,
      utilisateurEvalue: utilisateurEvalueId,
      annonce: annonceId,
      note,
      commentaire,
    });

    const evaluations = await Evaluation.find({ utilisateurEvalue: utilisateurEvalueId });
    const moyenne = evaluations.reduce((acc, curr) => acc + curr.note, 0) / evaluations.length;

    await User.findByIdAndUpdate(utilisateurEvalueId, { noteMoyenne: moyenne });

    res.status(201).json(nouvelleEvaluation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création de l'évaluation." });
  }
};

exports.getEvaluationsUtilisateur = async (req, res) => {
  try {
    const { userId } = req.params;

    const evaluations = await Evaluation.find({ utilisateurEvalue: userId })
      .populate("evaluateur", "firstname lastname role")
      .populate("annonce", "depart destination date")
      .sort({ createdAt: -1 });

    res.status(200).json(evaluations);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des évaluations utilisateur." });
  }
};

exports.getEvaluationsAnnonce = async (req, res) => {
  try {
    const { annonceId } = req.params;

    const evaluations = await Evaluation.find({ annonce: annonceId })
      .populate("evaluateur", "firstname lastname role")
      .populate("utilisateurEvalue", "firstname lastname role")
      .sort({ createdAt: -1 });

    res.status(200).json(evaluations);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des évaluations d'annonce." });
  }
};

exports.supprimerEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const evaluation = await Evaluation.findById(evaluationId);

    if (!evaluation) {
      return res.status(404).json({ message: "Évaluation introuvable." });
    }

    if (req.user.id !== evaluation.evaluateur.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé à supprimer cette évaluation." });
    }

    await Evaluation.findByIdAndDelete(evaluationId);
    res.status(200).json({ message: "Évaluation supprimée avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'évaluation." });
  }
};
