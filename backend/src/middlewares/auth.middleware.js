const foodPartnerModel = require('../models/foodPartner.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.body.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

async function authUserMiddleware(req, res, next) {
    let token;
    if(req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
    } else {
        token = req.body.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        
        if (user) {
            req.user = user;
            return next();
        }

        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            req.user = foodPartner;
            return next();
        }

        return res.status(401).json({ message: 'Unauthorized' });

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = { authFoodPartnerMiddleware, authUserMiddleware };