const express = require('express');
const cors=require('cors');
require("dotenv").config();
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const fileRoutes = require('./src/routes/fileRoutes');
const authRoutes = require('./src/routes/authRoutes');
const dbConfig = require('./src/config/db');


const app = express();

// Database connection
dbConfig();

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: false, // Ensure this is set to false for HTTP
    } 
}));


// Route for handling file uploads
app.use('/api/files', fileRoutes);
app.use('/auth',authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
