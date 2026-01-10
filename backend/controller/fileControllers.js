const File = require('../model/fileModel');
const { v4: uuidv4 } = require('uuid');

const path = require('path');
const fs = require('fs');

// Cloudinary configuration
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration
const multer = require('multer');


// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'file_sharing_uploads',
    resource_type: 'raw',   // ⭐ REQUIRED for PDFs
    public_id: () => uuidv4(),
  },
});


// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
    }
};

// Multer upload middleware
const upload = multer({ 
    storage: storage,
    // fileFilter: fileFilter
}).single('file');

// Controller to handle file upload
const uploadFile = (req, res) => {
    console.log("File uploading");
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user found' });
    }
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            // Save the file details in the database, including Cloudinary URL
            const fileData = new File({
                originalName: req.file.originalname,
                uniqueName: req.file.filename,
                userId: req.user,
                size: req.file.size,
                url: req.file.path // Cloudinary URL
            });
            await fileData.save();
            res.status(200).json({
                message: 'File uploaded successfully',
                file: req.file,
                url: req.file.path
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to save file data' });
        }
    });
};

// Controller to handle file download (returns Cloudinary URL)
const downloadFile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user found' });
    }
    try {
        const fileId = req.params.id;
        const file = await File.findOne({ $or: [ { uniqueName: fileId, userId: req.user }, { uniqueName: fileId, isShareable: true } ] });
        if (!file) {
            return res.status(404).json({ message: 'File not found or unauthorized access' });
        }
        // Return the Cloudinary URL for the file
        if (file.url) {
            return res.status(200).json({ url: file.url, originalName: file.originalName });
        } else {
            return res.status(404).json({ message: 'File URL not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to download file', error });
    }
};

const shareFile=async(req,res)=>{
    try {
        const fileId = req.params.id;
        console.log("Sharing file",fileId)
        const file = await File.findOne({ uniqueName: fileId });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        file.isShareable = true;
        await file.save();
        res.status(200).json({ message: 'File shareability updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update file shareability', error });
    }
}

module.exports = { uploadFile, downloadFile,shareFile };
