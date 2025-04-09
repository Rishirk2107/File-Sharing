const File = require('../model/fileModel');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../utils/s3Client');
require('dotenv').config();

// Multer memory storage (file is kept in RAM)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

// Upload to S3 helper
const uploadToS3 = async (buffer, key, mimetype) => {
  const parallelUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype
    }
  });

  parallelUpload.on('httpUploadProgress', (progress) => {
    console.log(`Upload progress:`, progress);
  });

  await parallelUpload.done();
};

// Controller: Upload file
const uploadFile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user found' });
  }

  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const uniqueName = `${uuidv4()}${path.extname(req.file.originalname)}`;

      // Upload to S3
      await uploadToS3(req.file.buffer, uniqueName, req.file.mimetype);

      // Save metadata to DB
      const fileData = new File({
        originalName: req.file.originalname,
        uniqueName: uniqueName,
        userId: req.user,
        size: req.file.size
      });

      await fileData.save();

      res.status(200).json({
        message: 'File uploaded successfully',
        file: {
          originalName: req.file.originalname,
          uniqueName,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload file' });
    }
  });
};

// Controller: Download file
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const stream = require('stream');

const downloadFile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user found' });
  }

  try {
    const fileId = req.params.id;

    const file = await File.findOne({
      $or: [
        { uniqueName: fileId, userId: req.user },
        { uniqueName: fileId, isShareable: true }
      ]
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found or unauthorized access' });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.uniqueName
    });

    const data = await s3Client.send(command);

    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', data.ContentType);

    data.Body.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to download file' });
  }
};

// Controller: Share file
const shareFile = async (req, res) => {
  try {
    const fileId = req.params.id;
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
};

module.exports = { uploadFile, downloadFile, shareFile };
