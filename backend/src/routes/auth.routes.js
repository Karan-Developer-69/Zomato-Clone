const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', authController.loginUser);

router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
// router.get('/user/logout', authController.logoutUser);

router.post('/food-partner/register', authController.registerFoodPartner);
router.post('/food-partner/login', authController.loginFoodPartner);
// router.get('/food-partner/logout', authController.logoutFoodPartner);

// Check authentication status
router.post('/status', authController.checkAuthStatus);

module.exports = router;