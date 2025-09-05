const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food-partner.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/:id', authMiddleware.authUserMiddleware, foodController.get);

module.exports = router;