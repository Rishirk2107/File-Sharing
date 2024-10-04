const File = require("../model/fileModel");

const data = async (req, res) => {
    try {
        const email = req.session.email;
        console.log(req.session,"Hello world");
        console.log(req.body.preference,"Body here");

        if (!email) {
            return res.status(400).json({ "error": 2, "message": "Email not found in session" });
        }
        console.log("all perfect");

        const { preference } = req.body;

        if (!preference || !preference.type || !preference.value) {
            return res.status(400).json({ "error": 1, "message": "Invalid request body, preference data is missing" });
        }

        const { type, value } = preference;
        console.log(type,value,"type and value");

        let files;
        if (type == "originalName") {
            files = await File.find({ "email": email }, { _id: 0, uniqueName: 1 ,originalName : 1}).sort({ "originalName": value });
        } else if (type == 'uploadDate') {
            files = await File.find({ "email": email }, { _id: 0, uniqueName: 1 ,originalName : 1}).sort({ "uploadDate": value });
        } else if (type == 'size') {
            files = await File.find({ "email": email }, { _id: 0, uniqueName: 1, originalName : 1}).sort({ 'size': value });
        } else {
            files = await File.find({ "email": email }, { _id: 0, uniqueName: 1 ,originalName : 1});
        }
        console.log(files,"files");

        if (files.length === 0) {
            return res.status(404).json({ "message": "No files found" });
        }
        console.log(files[0].uniqueName);
        res.status(200).json(files);

    } catch (error) {
        console.log(error);
        res.status(500).json({ "error": "An error occurred while retrieving files" });
    }
};

module.exports = { data };