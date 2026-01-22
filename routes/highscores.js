const express = require("express");
const HighScore = require("../models/HighScore");

const router = express.Router();

router.post("/", async (req,res)=>{
    
    try{
        const {playername, score, level} = req.body;
        const createdScore = await HighScore.create({playername, score, level});

        res.status(201).json({ok:true, createdScore});

    } catch(err)
    {
        res.status(400).json({ok:false, error:"Invalid High Score"});
    }
});


router.get("/", async (req,res)=>{
    try{
        console.log("Fetch working");
        const scores = await HighScore.find()
        .sort({score:-1,createdAt:1})
        .limit(10);
        res.json(scores);
    }catch(err)
    {
        res.status(500).json({ok:false, error: "Failed to fetch High Scores"});
    }
});

module.exports = router;