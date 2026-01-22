const scoreList = document.getElementById("scoreList");
const statusDisplay = document.getElementById("status");
const form = document.getElementById("scoreForm");

async function loadScores(){
    scoreList.innerHTML = "";
    statusDisplay.textContent = "Loading Scores...";

    try{
        const res = await fetch("/api/highscores");
        const scores = await res.json();

        if(scores.length === 0){
            statusDisplay.textContent = "No scores available";
            return
        }

        scores.forEach(score => {
            const li = document.createElement("li");

            li.textContent = `${score.playername} - ${score.score} - ${score.level}`;
            scoreList.appendChild(li);
        });

        statusDisplay.textContent = `Loaded ${scores.length} scores`;
    }
    catch(err){
        statusDisplay.textContent = "Failed to load scores"
    }
}


form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const playername = document.getElementById("playername").value;
     const score = document.getElementById("score").value;
      const level = document.getElementById("level").value;
    statusDisplay.textContent = "Submitting new score...";
    console.log("Form route");
    try{
        await fetch("/api/highscores", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({playername,score,level})
        });

        form.reset()
        loadScores();
    }catch(err){
        statusDisplay.textContent = "Failed to submit score"
    }
});



loadScores();