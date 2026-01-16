const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 3000;

//static route

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

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

/*/JSON
app.get("/api/data", (req,res)=>{
    res.json({player:"JordanTron", 
    timestamp:new Date(),
    games:["Fortnite", "Arc Raiders", "Portal2"]

    });
});*/

app.get("/api/games", (req,res)=>{
    fs.readFile("data.json", "utf-8", (err,data)=>{
        if (err){
            res.status(500).json({error:"Failed to read data file"});
            return;
        }

        res.json(JSON.parse(data));
    });
});

let leaderboard = [
    {player:"Corey", score:1200},
    {player:"Nate", score:1100}
]

app.post("/leaderboard", (req,res)=>{
    const {player, score} = req.body;
    //validation

    if (typeof player != "string" || typeof score != "number"){
        return res.status(400).json({
            ok:false,
            error:"Expected JSON body: {player:string, score:number}"
        });
    }

    leaderboard.push({player,score});

    leaderboard.sort((a,b)=>b.score - a.score);

    console.log(leaderboard);
    res.status(201).json({ok:true, leaderboard});

});
//Start server

app.listen(PORT, ()=>{
    console.log(`Running on port: ${PORT}`)
});