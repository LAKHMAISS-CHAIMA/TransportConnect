const router = require("express").Router();
const ratingController = require("../controllers/rating.controller");
const auth = require("../middlewares/auth");

router.post("/", auth, ratingController.leaveRating);
router.get("/:userId", ratingController.getUserRatings);

module.exports = router;
