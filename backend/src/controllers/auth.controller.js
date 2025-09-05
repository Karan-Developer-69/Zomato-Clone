const userModel = require('../models/user.model');
const foodPatnerModel = require('../models/foodPartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) { 
    const { fullName, email, password } = req.body;

    const isUserPresent = await userModel.findOne({ email });
    if (isUserPresent) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(201).json({ message: 'User registered successfully',
        user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
        }
     });
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(200).json({ message: 'Login successful',
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
        }
     });

}

function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

async function registerFoodPartner(req, res) {
    const { name, contactName, phone, address, email, password } = req.body;

    const isAccountExists = await foodPatnerModel.findOne({ email });
    if (isAccountExists) {
        return res.status(400).json({ message: 'Account already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFoodPartner = await foodPatnerModel.create({
        name,
        email,
        password: hashedPassword,
        contactName,
        phone,
        address
    });

    const token = jwt.sign({ id: newFoodPartner._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(201).json({ message: 'Food partner registered successfully',
        foodPartner: {
            id: newFoodPartner._id,
            name: newFoodPartner.name,
            email: newFoodPartner.email,
            contactName: newFoodPartner.contactName,
            phone: newFoodPartner.phone,
            address: newFoodPartner.address
        }
     });
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body;

    const foodPartner = await foodPatnerModel.findOne({ email });
    if (!foodPartner) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(200).json({ message: 'Login successful',
        foodPartner: {
            id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone,
            address: foodPartner.address
        }
     });
}

function logoutFoodPartner(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Food partner logout successfully' });
}

module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner     };