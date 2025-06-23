const express = require("express");
const router = express.Router();
const { creerDemande, getDemandesByAnnonce, updateDemandeStatut, getDemandesUtilisateur, deleteDemande } = require("../controllers/demandeController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, creerDemande);
router.get("/mes-demandes", protect, getDemandesUtilisateur);
router.get("/annonce/:id", protect, getDemandesByAnnonce);
router.put("/:id", protect, updateDemandeStatut);
router.delete("/:id", protect, deleteDemande);

module.exports = router;
