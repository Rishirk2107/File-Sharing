const File = require('../model/fileModel');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Multer configuration
const multer = require('multer');

// Storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
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
    console.log("File uploading")
    // Check if the user is logged in (i.e., email is present in session)
    if (!req.session.email) {
        return res.status(401).json({ message: 'Unauthorized: No session found' });
    }

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            // Save the file details in the database
            const fileData = new File({
                originalName: req.file.originalname,
                uniqueName: req.file.filename,
                email: req.session.email, // Store the email from session
                size:req.file.size
            });

            await fileData.save();

            res.status(200).json({
                message: 'File uploaded successfully',
                file: req.file
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to save file data' });
        }
    });
};

// Controller to handle file download
const downloadFile = async (req, res) => {
    // Check if the user is logged in (i.e., email is present in session)
    if (!req.session.email) {
        return res.status(401).json({ message: 'Unauthorized: No session found' });
    }

    try {
        const fileId = req.params.id;

        // Find the file by its unique name and ensure it belongs to the logged-in user
        const file = await File.findOne({$or:[{ uniqueName: fileId, email: req.session.email },{uniqueName:fileId, isShareable:true}]});

        if (!file) {
            return res.status(404).json({ message: 'File not found or unauthorized access' });
        }

        // Get the path to the file
        const filePath = path.join(__dirname, '../uploads', file.uniqueName);
        console.log(filePath);
        // Check if file exists on server
        if (fs.existsSync(filePath)) {
            // Download the file
            return res.download(filePath, file.originalName); // originalName as the download name
        } else {
            return res.status(404).json({ message: 'File not found on server' });
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
