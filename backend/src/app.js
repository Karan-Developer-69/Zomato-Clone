const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Default to Vite dev server
    credentials: true, // Allow cookies to be sent
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'lax',
    secure: process.env.NODE_ENV === 'production' // Only secure in production
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the API');
}); 


module.exports = app;