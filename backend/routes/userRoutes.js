const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, protect } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/role");

router.get("/me", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);
router.get("/", auth, checkRole("admin"), userController.getAllUsers);

module.exports = router;
