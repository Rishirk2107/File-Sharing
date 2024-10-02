const File =require("../models/fileModel");

const data = async(req,res)=>{
    try {
        const email = req.session.email;
        const condition = req.body.preference.type;
        const value = req.body.preference.value;

        if(!email){
            return res.status(400).json({"error":2});
        }
        var files;
        if(condition=="originalName"){
            files=await File.find({"email":email},{_id:0,uniqueName:1}).sort({"originalName":value});    
        }
        else if(condition=='uploadDate'){
            files=await File.find({"email":email},{_id:0,uniqueName:1}).sort({"uploadDate":value});
        }
        else if(condition=='size'){
            files=await File.find({"email":email},{_id:0,uniqueName:1}).sort({'size':value});
        }
        else{
            files=await File.find({"email":email},{_id:0,uniqueName:1});
        }
        console.log(files[0].uniqueName);
        res.status(200).json(files);
    
    }
    catch(error){
        console.log(error);
    }
}

module.exports={data}