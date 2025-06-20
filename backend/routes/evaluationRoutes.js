const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/evaluationController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, evaluationController.creerEvaluation);
router.get("/utilisateur/:userId", evaluationController.getEvaluationsUtilisateur);
router.get("/annonce/:annonceId", evaluationController.getEvaluationsAnnonce);
router.delete("/:evaluationId", protect, evaluationController.supprimerEvaluation);

module.exports = router;
