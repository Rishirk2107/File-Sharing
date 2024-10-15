const express = require('express');
const router = express.Router();
const {uploadFile,downloadFile,shareFile} = require('../controller/fileControllers');
const {data} = require("../controller/viewer");

// POST route for uploading a file
router.post('/upload', uploadFile);
router.get('/download/:id', downloadFile);
router.post("/list",data);
router.get("/share/:id",shareFile);

module.exports = router;
