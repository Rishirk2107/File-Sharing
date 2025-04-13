const File = require("../model/fileModel");

const data = async (req, res) => {
    try {
        const {preference} = req.body;
        const userId=req.user;

        
        if (!userId) {
            return res.status(400).json({ "error": 2, "message": "userId not found in session" });
        }

        if (!preference || !preference.type || !preference.value) {
            return res.status(400).json({ "error": 1, "message": "Invalid request body, preference data is missing" });
        }

        const { type, value } = preference;

        let files;
        if (type == "originalName") {
            files = await File.find({ "userId": userId }, { _id: 0, uniqueName: 1 ,originalName : 1}).sort({ "originalName": value });
        } else if (type == 'uploadDate') {
            files = await File.find({ "userId": userId }, { _id: 0, uniqueName: 1 ,originalName : 1}).sort({ "uploadDate": value });
        } else if (type == 'size') {
            files = await File.find({ "userId": userId }, { _id: 0, uniqueName: 1, originalName : 1}).sort({ 'size': value });
        } else {
            files = await File.find({ "userId": userId }, { _id: 0, uniqueName: 1 ,originalName : 1});
        }

        if (files.length === 0) {
            return res.status(404).json({ "message": "No files found" });
        }
        console.log(files);
        res.status(200).json(files);

    } catch (error) {
        console.log(error);
        res.status(500).json({ "error": "An error occurred while retrieving files" });
    }
};

module.exports = { data };