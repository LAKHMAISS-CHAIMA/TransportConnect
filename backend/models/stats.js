const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin"); 

router.get("/", auth, isAdmin, statsController.getStats);

module.exports = router;
