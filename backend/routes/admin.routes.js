const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

router.use(protect, checkRole("admin"));

router.get("/users", adminController.getAllUsers);
router.put("/users/:userId/verify", adminController.verifyUser);
router.put("/users/:userId/suspend", adminController.suspendUser);
router.delete("/users/:userId", adminController.deleteUser);

router.get("/annonces", adminController.getAllAnnonces);
router.delete("/annonces/:annonceId", adminController.deleteAnnonce);

router.get("/demandes", adminController.getAllDemandes);

router.get("/stats", adminController.getStats);
router.get("/stats/graph", adminController.getGraphStats);

module.exports = router;
