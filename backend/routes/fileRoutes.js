const express = require('express');
const router = express.Router();
const {uploadFile,downloadFile,shareFile} = require('../controller/fileControllers');
const {data} = require("../controller/viewer");
const {authenticate} =require("../middleware/authMiddleware");

// POST route for uploading a file
router.post('/upload',authenticate ,uploadFile);
router.get('/download/:id',authenticate ,downloadFile);
router.post("/list",authenticate,data);
router.get("/share/:id",shareFile);

module.exports = router;
