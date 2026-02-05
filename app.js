const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;



const GamesRoutes = require("./routes/games");

const authRoutes = require("./routes/auth");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/games", require("./routes/games") );
//static route
//Quick Test that env Variables are available
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





app.get("/", (req,res)=>{
    res.send("The server is running")

});

app.get("/main", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/secondpage", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "secondpage.html"));
});
app.get("/thirdpage", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "thirdpage.html"));
});


//Start server
//Requests using MongoDB Database and Mongoose
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



//Connection with Database and Sever
connectToMongo().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Running on port: ${PORT}`);
    });
})