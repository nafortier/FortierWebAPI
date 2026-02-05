const express = require("express");
const Game = require("../models/Game");
const requireAuth = require("../middleware/requireauth")

const router = express.Router();
router.use(requireAuth);
router.post("/", async (req,res)=>{
    
    try{
        const userId = req.user.sub;
        const {gametitle} = req.body;
        const createdGame = await Game.create({userId, gametitle});

        res.status(201).json({ok:true, createdGame});

    } catch(err)
    {
        res.status(400).json({ok:false, error:"Invalid Game"});
    }
});

//get
router.get("/", async (req,res)=>{
    try{
        const userId = req.user.sub;
        console.log("Fetch working");
        const games = await Game.find({userId})
        //.sort({score:-1,createdAt:1})
        .limit(10);
        res.json(games);
    }catch(err)
    {
        res.status(500).json({ok:false, error: "Failed to fetch Games"});
    }
});


//Delete

router.delete("/:id", async (req,res)=>{
    try{
        const userId = req.user.sub;
        const {id} = req.params;
        const deleted = await Game.findByIdAndDelete({_id:id, userId});

        if(!deleted){
            return res.status(404).json({ok:false, error: "Game not found"});
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
        const game = await Game.findById(req.params.id);

        if(!game){
            return res.status(404).json({ok:false, error:"Not found"})
        }
        res.json(game);
    } catch{
        return res.status(400).json({ok:false, error:"Invalid Id"})
    }
});

router.put("/:id", async (req,res)=>{
    try{
       
        const {id} = req.params;
        const userId = req.user.sub;

        const payload = {};
        if (typeof req.body.gametitle === "string"){
            payload.gametitle = req.body.gametitle;
        }
       

        const updatedEntry = await Game.findByIdAndUpdate({_id:id, userId},payload,{
            new:true,
            runValidators:true
        });
        
        if(!updatedEntry){
            res.status(404).json({ok:false, error:"Game not found"})
            
        }
        res.json({ok:true, updatedEntry});
        

    } catch(err){
        res.status(400).json({ok:false, error:"Update Failed"})
        
    }

});
module.exports = router;