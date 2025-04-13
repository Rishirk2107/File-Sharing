const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const fileRoute = require("./routes/fileRoutes");
const { authenticate } = require("./middleware/authMiddleware");

const MONGO_URI = process.env.MONGO_URI;

function startServer(port) {
    const app = express();

    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/auth", authRoutes);
    app.use("/api/files", fileRoute);
    app.get("/protected", authenticate, (req, res) => {
        res.json({ message: 'You accessed a protected route', user: req.user });
    });

    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log(`✅ Connected to MongoDB for port ${port}`);
            app.listen(port, () => {
                console.log(`🚀 Server running on http://localhost:${port}`);
            });
        })
        .catch((err) => {
            console.error(`❌ MongoDB connection error on port ${port}:`, err);
        });
}

// If the file is run directly with a number arg (e.g. node server.js 3)
if (require.main === module) {
    const numberOfServers = 4;
    const basePort = 3001;

    for (let i = 0; i < numberOfServers; i++) {
        startServer(basePort + i);
    }
}

module.exports = startServer;
