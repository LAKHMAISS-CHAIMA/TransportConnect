const express = require("express");
const router = express.Router();
const { creerDemande, getDemandesByAnnonce, updateDemandeStatut, getDemandesUtilisateur } = require("../controllers/demandeController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, creerDemande); 
router.get("/annonce/:id", protect, getDemandesByAnnonce); 
router.put("/:id", protect, updateDemandeStatut);
router.get("/mes-demandes", protect, getDemandesUtilisateur);

module.exports = router;
