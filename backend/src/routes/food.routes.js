const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post('/', upload.single('video'),authMiddleware.authFoodPartnerMiddleware,  foodController.createFood);
router.get('/', authMiddleware.authUserMiddleware, foodController.getFoodItems);
router.post('/like', authMiddleware.authUserMiddleware, foodController.likeFood);
router.post('/save', authMiddleware.authUserMiddleware, foodController.saveFood);
router.get('/save', authMiddleware.authUserMiddleware, foodController.getSavedFood);

module.exports = router;
