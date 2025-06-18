const Annonce = require("../models/annonceModel");

const getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find()
      .populate("conducteur", "firstname lastname") 
      .sort({ createdAt: -1 }); 

    res.status(200).json(annonces);
  } catch (error) {
    console.error("Erreur dans getAllAnnonces:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const createAnnonce = async (req, res) => {
  try {
    const { depart, etapes, destination, dateTrajet, dimensions, typeMarchandise, capaciteDisponible } = req.body;
    
    const newAnnonce = await Annonce.create({
      conducteur: req.user._id,
      depart,
      etapes,
      destination,
      dateTrajet,
      dimensions,
      typeMarchandise,
      capaciteDisponible
    });

    const populatedAnnonce = await Annonce.findById(newAnnonce._id)
      .populate("conducteur", "firstname lastname");

    res.status(201).json(populatedAnnonce);
  } catch (error) {
    console.error("Erreur dans createAnnonce:", error.message);
    res.status(500).json({ message: "Erreur lors de la création de l'annonce" });
  }
};

const updateAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: "Annonce non trouvée" });

    if (annonce.conducteur.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Non autorisé à modifier cette annonce" });
    }

    const updated = await Annonce.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const deleteAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json({ message: "Annonce non trouvée" });

    if (annonce.conducteur.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Non autorisé à supprimer cette annonce" });
    }

    await annonce.deleteOne();
    res.status(200).json({ message: "Annonce supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const rechercherAnnonces = async (req, res) => {
  const { depart, destination, date, typeMarchandise } = req.query;

  const filter = {};

  if (depart) {
    filter.depart = { $regex: depart, $options: "i" }; 
  }

  if (destination) {
    filter.destination = { $regex: destination, $options: "i" };
  }

  if (date) {
    const dateDebut = new Date(date);
    const dateFin = new Date(date);
    dateFin.setHours(23, 59, 59, 999);

    filter.dateTrajet = { $gte: dateDebut, $lte: dateFin };
  }

  if (typeMarchandise) {
    filter.typeMarchandise = { $regex: typeMarchandise, $options: "i" };
  }

  try {
    const annonces = await Annonce.find(filter).populate("conducteur", "firstname lastname");
    res.status(200).json(annonces);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = { getAllAnnonces, createAnnonce, updateAnnonce, deleteAnnonce, rechercherAnnonces };
