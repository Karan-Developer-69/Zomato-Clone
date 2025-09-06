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
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ message: 'Login successful',
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
        }
     });

}

function logoutUser(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
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
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

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
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Food partner logout successfully' });
}

async function checkAuthStatus(req, res) {
    try {
        console.log("cookie",req.cookies);
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No token found', isAuthenticated: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's a user
        const user = await userModel.findById(decoded.id);
        if (user) {
            return res.status(200).json({ 
                message: 'User authenticated', 
                isAuthenticated: true,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    type: 'user'
                }
            });
        }

        // Check if it's a food partner
        const foodPartner = await foodPatnerModel.findById(decoded.id);
        if (foodPartner) {
            return res.status(200).json({ 
                message: 'Food partner authenticated', 
                isAuthenticated: true,
                user: {
                    id: foodPartner._id,
                    name: foodPartner.name,
                    email: foodPartner.email,
                    contactName: foodPartner.contactName,
                    phone: foodPartner.phone,
                    address: foodPartner.address,
                    type: 'foodPartner'
                }
            });
        }

        return res.status(401).json({ message: 'Invalid token', isAuthenticated: false });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', isAuthenticated: false });
    }
}

module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner, checkAuthStatus };