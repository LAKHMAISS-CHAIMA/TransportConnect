const Demande = require("../models/demandeModel");
const Annonce = require("../models/annonceModel");
const sendNotification = require("../utils/sendNotification");

const creerDemande = async (req, res) => {
  try {
    const { annonceId, dimensions, poids, typeColis, description } = req.body;

    const annonce = await Annonce.findById(annonceId);
    if (!annonce) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }

    const nouvelleDemande = new Demande({
      annonce: annonceId,
      expediteur: req.user._id, 
      dimensions,
      poids,
      typeColis,
      description,
    });

    const saved = await nouvelleDemande.save();

    await sendNotification(
      annonce.conducteur,
      "request",
      `Vous avez reçu une nouvelle demande sur votre annonce.`,
      saved._id
    );

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getDemandesByAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) return res.status(404).json({ message: "Annonce non trouvée" });

    if (annonce.conducteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const demandes = await Demande.find({ annonce: req.params.id }).populate("expediteur", "name email");

    res.status(200).json(demandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

const updateDemandeStatut = async (req, res) => {
  const { statut } = req.body;

  if (!["acceptée", "refusée"].includes(statut)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    let demande = await Demande.findById(req.params.id).populate("annonce");

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    if (demande.annonce.conducteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé à modifier cette demande" });
    }

    demande.statut = statut;
    const updatedDemande = await demande.save();

    await sendNotification(
      demande.expediteur,
      "request",
      `Votre demande concernant l'annonce "${demande.annonce.titre}" a été ${statut}.`,
      updatedDemande._id
    );

    const result = await Demande.findById(updatedDemande._id)
      .populate('expediteur', 'name')
      .populate('annonce');

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getDemandesUtilisateur = async (req, res) => {
  try {
    const demandes = await Demande.find({ expediteur: req.user._id })
      .populate({
        path: "annonce",
        select: "depart destination dateTrajet conducteur",
        populate: {
          path: "conducteur",
          select: "name firstname"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(demandes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const deleteDemande = async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);

    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    if (demande.expediteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Action non autorisée." });
    }

    await demande.deleteOne();

    res.status(200).json({ message: "Demande annulée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { 
  creerDemande, 
  getDemandesByAnnonce, 
  updateDemandeStatut, 
  getDemandesUtilisateur,
  deleteDemande
};

