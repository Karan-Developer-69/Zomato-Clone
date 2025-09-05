const foodPartnerModel = require('../models/foodPartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req, res) {
    try {
        const foodPartnerId = req.params.id;
        const foodPartner = await foodPartnerModel.findById(foodPartnerId).select('-password');
        const foodItems = await foodModel.find({ foodPartner: foodPartnerId });
        if (!foodPartner) {
            return res.status(404).json({ message: 'Food partner not found' });
        }
        res.status(200).json({message:'Food partner retrieved successfully',foodPartner:{ ...foodPartner.toObject(), foodItems } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    get: getFoodPartnerById,
};