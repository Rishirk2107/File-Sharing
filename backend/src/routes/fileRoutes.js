const express = require('express');
const router = express.Router();
const {uploadFile,downloadFile} = require('../controllers/fileControllers');
const {data} = require("../controllers/viewer");

// POST route for uploading a file
router.post('/upload', uploadFile);
router.get('/download/:id', downloadFile);
router.get("/list",data);

module.exports = router;
