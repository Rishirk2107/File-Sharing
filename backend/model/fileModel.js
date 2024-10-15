const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    uniqueName: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    email:{
        type:String,
        required:true
    },
    isShareable:{
        type:Boolean,
        default:false
    },
    size:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('File', fileSchema);
