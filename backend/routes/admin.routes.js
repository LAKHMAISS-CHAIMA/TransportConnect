const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

router.use(auth, isAdmin);

router.get("/dashboard", adminController.getStats);
router.get("/users", adminController.getUsers);
router.put("/users/:id/verify", adminController.verifyUser);
router.put("/users/:id/ban", adminController.banUser);
router.delete("/trips/:id", adminController.deleteTrip);

module.exports = router;
