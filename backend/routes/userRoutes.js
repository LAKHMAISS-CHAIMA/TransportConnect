const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, protect } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

router.get("/me", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);
router.get("/", auth, checkRole("admin"), userController.getAllUsers);
router.put("/validate/:id", auth, checkRole("admin"), userController.validateUser);
router.put("/suspend/:id", auth, checkRole("admin"), userController.suspendUser);
router.delete("/:id", auth, checkRole("admin"), userController.deleteUser);

module.exports = router;
