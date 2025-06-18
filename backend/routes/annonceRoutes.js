const express = require("express");
const router = express.Router();
const {getAllAnnonces, createAnnonce, updateAnnonce, deleteAnnonce,rechercherAnnonces } = require("../controllers/annonceController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/", getAllAnnonces);
router.post("/", protect, createAnnonce);
router.put("/:id", protect, updateAnnonce);   
router.delete("/:id", protect, deleteAnnonce);
router.get("/search", rechercherAnnonces);

module.exports = router;
