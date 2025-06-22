const express = require("express");
const router = express.Router();
const {getAllAnnonces, createAnnonce, updateAnnonce, deleteAnnonce,rechercherAnnonces, getMesAnnonces } = require("../controllers/annonceController");

const { protect } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

router.get("/", getAllAnnonces);
router.get("/recherche", rechercherAnnonces);
router.post("/", protect, checkRole('conducteur'), createAnnonce);
router.get("/conducteur/me", protect, checkRole('conducteur'), getMesAnnonces);
router.put("/:id", protect, checkRole('conducteur'), updateAnnonce);   
router.delete("/:id", protect, deleteAnnonce);

module.exports = router;
