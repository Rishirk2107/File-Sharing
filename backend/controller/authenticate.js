const {User}=require("../model/collection");
const jwt = require('jsonwebtoken');
const {gmailer,generate2FACode} = require("../config/mailer")

const loginUser =async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log(email,password);
        const user=await User.findOne({email});
        if (!user){
            return res.status(400).json({"error":2});
        }
        const isMatch=(user.password==password);
        if (!isMatch){
            return res.status(406).json({"error":1});
        }

        const token=jwt.sign({userId:user.userId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
        
        res.json({"token":token});

        }
    catch(err){
        console.log("Error at logging in:",err);
        return res.status(400).json({"error":3});
    }
}

const registerUser = async (req, res) => {
    try{
        console.log(req.body);   
    const {username,password,email}=req.body;
    console.log(req.body);
    const user=await User.findOne({email});
    if (user){
        console.log("Email Already exists")
        return res.status(409).json({"error":1});
    }
    const newUser=new User({
        name:username,
        password:password,
        email:email,
    });
        await newUser.save();
        return res.status(200).json({"error":0});
    }
    catch(error){
        console.log("Error at signing up",error);
        return res.status(400).json({"error":2});
    }
};

const verify2fa = async (req,res) => {
    try{
        const {otp} = req.body;
        //console.log(req.session)
        if (otp==req.session.otp){
            return res.status(200).json({"error":0})
        }
        return res.status(401).json({"error":1});
    }
    catch(error){
        console.log("Error at OTP Verification",error);
        return res.status(500).json({"error":2});
    }
}


module.exports={loginUser,registerUser,verify2fa};