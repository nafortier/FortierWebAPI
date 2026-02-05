const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router  = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET)throw new Error("Missing JWT Secret");

router.post("/register", async (req,res)=>{
    console.log("Register")
    try{
        const {username, password} = req.body; 
        console.log(req.body);

        if(typeof username !== "string" || typeof password !== "string"){
            return res.status(400).json({ok:false, error:"username and password required"});
        }

        const existing = await User.findOne({username});
        if(existing){
            return res.status(400).json({ok:false, error:"User already exists"});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({username, password:passwordHash});

        res.status(201).json({ok:true});
    }catch(err){
        console.log(err);
        res.status(500).json({ok:false, error:"Failed to register new user"});
    }
});


router.post("/login", async (req,res)=>{
    console.log("login")
    try{

        const {username, password} = req.body; 

        //console.log(req.body);
       
        const user = await User.findOne({username});
        if(!user){
            //console.log("1")
            return res.status(401).json({ok:false, error:"Invalid credentials"});
           
        }
        const ok = await bcrypt.compare(password, user.password);

        if (!ok){
            //console.log("2")
            return res.status(401).json({ok:false, error:"Password does not match"});
            
        }

        const token = jwt.sign({
            sub:user._id.toString(),
            username:user.username,


        },
        JWT_SECRET,
        {expiresIn:"2h"}
        );
        //console.log("ok")
        res.json({ok:true, token});
    }catch(err){
        console.log(err);
        res.status(500).json({ok:false, error:"Failed to login user"});
    }
});

module.exports = router;
