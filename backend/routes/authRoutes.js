const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const { registerSchema } = require('../validators/authValidator');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
