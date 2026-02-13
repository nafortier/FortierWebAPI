const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const MONGO_URI = process.env.MONGO_URI;

//const authRoutes = require("./routes/auth");
app.use("/api/highscores", require("./routes/Highscores") );

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if(!MONGO_URI){
    console.error("Missing Database Connection");
    process.exit(1);
}
async function connectToMongo(){
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.error("MongoDB connection error: ", error.message);
        process.exit(1);
    }
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



const gameSchema = new mongoose.Schema({},{strict:false});
const VideoGameData = mongoose.model("gameprofiles", gameSchema);

app.get("/api/gamesprofile", async (req,res)=>{
    const games = await VideoGameData.find();
    console.log(games);
    res.json(games);
});

app.get("/api/gamesprofile/:game", async (req,res)=>{
    const game = req.params.game;
    const gameentry = await VideoGameData.findOne({game});
    console.log(gameentry);
    res.json(gameentry);
});

connectToMongo().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Running on port: ${PORT}`);
    });
})