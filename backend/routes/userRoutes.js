const router = require("express").Router();
const {userController, updateUser }  = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.get("/me", auth, userController.getProfile);
router.put("/me", auth, userController.updateProfile);
router.put("/update", auth, updateUser);

module.exports = router;
