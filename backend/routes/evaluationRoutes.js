const express = require('express');
const router = express.Router();
const { laisserEvaluation } = require("../controllers/evaluationController");
const auth = require("../middlewares/auth");

router.post("/", auth, laisserEvaluation);

module.exports = router;
