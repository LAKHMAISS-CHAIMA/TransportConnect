const express = require("express");
const router = express.Router();
const {getAllAnnonces, createAnnonce, updateAnnonce, deleteAnnonce,rechercherAnnonces } = require("../controllers/annonceController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/", getAllAnnonces);
router.get("/recherche", rechercherAnnonces);
router.post("/", protect, createAnnonce);
router.put("/:id", protect, updateAnnonce);   
router.delete("/:id", protect, deleteAnnonce);

module.exports = router;
