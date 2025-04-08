const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
require("dotenv").config()

const authRoutes=require("./routes/authRoutes");
const issueRoute=require("./routes/issueRoute");
const fileRoute=require("./routes/fileRoutes");
const {authenticate} =require("./middleware/authMiddleware");

const PORT=process.env.PORT;

const app=express();

app.use(cors({
    origin: 'http://localhost:3000', // React app origin
    credentials: true // Allow cookies and sessions to be included
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/auth",authRoutes);
app.use("/issue",issueRoute);
app.use("/api/files",fileRoute)
app.get("/protected",authenticate,(req,res)=>{
    res.json({ message: 'You accessed a protected route', user: req.user });
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});