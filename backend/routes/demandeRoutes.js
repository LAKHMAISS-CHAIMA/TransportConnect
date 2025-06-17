const express = require("express");
const router = express.Router();
const { getDemandesByAnnonce, updateDemandeStatut } = require("../controllers/demandeController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/annonce/:id", protect, getDemandesByAnnonce); 
router.put("/:id", protect, updateDemandeStatut);

module.exports = router;
