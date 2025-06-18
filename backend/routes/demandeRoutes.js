const express = require("express");
const router = express.Router();
const { creerDemande, getDemandesByAnnonce, updateDemandeStatut, getDemandesUtilisateur } = require("../controllers/demandeController");
const { auth, protect } = require("../middlewares/authMiddleware");

router.post("/", auth, creerDemande); 
router.get("/annonce/:id", protect, getDemandesByAnnonce); 
router.put("/:id", protect, updateDemandeStatut);
router.get("/mes-demandes", auth, getDemandesUtilisateur);

module.exports = router;
