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

//get
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


//Delete

router.delete("/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        const deleted = await HighScore.findByIdAndDelete(id);

        if(!deleted){
            return res.status(404).json({ok:false, error: "Score not found"});
        }

        res.json({ok:true, deletedId:id});
    }catch(err)
    {
        res.status(400).json({ok:false, error: "Failed to Delete"});
    }
});

//get edit

router.get("/:id", async (req,res)=>{
    try{
        const score = await HighScore.findById(req.params.id);

        if(!score){
            return res.status(404).json({ok:false, error:"Not found"})
        }
        res.json(score);
    } catch{
        return res.status(400).json({ok:false, error:"Invalid Id"})
    }
});

module.exports = router;