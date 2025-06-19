const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

router.use(protect, checkRole("admin"));

router.get("/dashboard", adminController.getStats);
router.get("/users", adminController.getUsers);
router.put("/users/:id/verify", adminController.verifyUser);
router.put("/users/:id/ban", adminController.banUser);
router.delete("/trips/:id", adminController.deleteTrip);
router.put("/verify/:userId", protect, checkRole("admin"), adminController.verifyUser);

module.exports = router;
