const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/evaluationController");
const ratingController = require("../controllers/rating.controller");
const auth = require("../middlewares/auth");


router.post("/", auth, evaluationController.creerEvaluation);

router.get("/utilisateur/:userId", evaluationController.getEvaluationsUtilisateur);

router.get("/annonce/:annonceId", evaluationController.getEvaluationsAnnonce);

router.delete("/:evaluationId", auth, evaluationController.supprimerEvaluation);


router.post("/rating", auth, ratingController.leaveRating);

router.get("/rating/:userId", ratingController.getUserRatings);


module.exports = router;
