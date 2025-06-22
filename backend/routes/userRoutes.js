const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

router.get("/me", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);
router.get("/profile/stats", protect, userController.getUserStats);
router.get("/", protect, checkRole("admin"), userController.getAllUsers);
router.put("/validate/:id", protect, checkRole("admin"), userController.validateUser);
router.put("/suspend/:id", protect, checkRole("admin"), userController.suspendUser);
router.delete("/:id", protect, checkRole("admin"), userController.deleteUser);

module.exports = router;
