const Rating = require("../models/Rating");
const User = require("../models/User");

// Créer une évaluation
exports.createRating = async (req, res) => {
  try {
    const { ratedUserId, annonceId, rating, comment } = req.body;
    const raterId = req.user.id;

    // Vérifier que l'utilisateur ne s'évalue pas lui-même
    if (raterId === ratedUserId) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous évaluer vous-même" });
    }

    // Vérifier si une évaluation existe déjà
    const existingRating = await Rating.findOne({
      rater: raterId,
      ratedUser: ratedUserId,
      annonce: annonceId
    });

    if (existingRating) {
      return res.status(400).json({ message: "Vous avez déjà évalué cet utilisateur pour cette annonce" });
    }

    const newRating = await Rating.create({
      rater: raterId,
      ratedUser: ratedUserId,
      annonce: annonceId,
      rating,
      comment
    });

    // Mettre à jour la note moyenne de l'utilisateur évalué
    const userRatings = await Rating.find({ ratedUser: ratedUserId });
    const averageRating = userRatings.reduce((acc, curr) => acc + curr.rating, 0) / userRatings.length;
    
    await User.findByIdAndUpdate(ratedUserId, { averageRating });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'évaluation" });
  }
};

// Obtenir les évaluations d'un utilisateur
exports.getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ ratedUser: userId })
      .populate("rater", "firstname lastname")
      .populate("annonce", "depart destination")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des évaluations" });
  }
};

// Obtenir les évaluations d'une annonce
exports.getAnnonceRatings = async (req, res) => {
  try {
    const { annonceId } = req.params;
    const ratings = await Rating.find({ annonce: annonceId })
      .populate("rater", "firstname lastname")
      .populate("ratedUser", "firstname lastname")
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des évaluations" });
  }
};
