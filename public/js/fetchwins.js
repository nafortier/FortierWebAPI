const scoreList = document.getElementById("winList");
const statusDisplay = document.getElementById("status");


const token = localStorage.getItem("token");
if(!token){
    window.location.href = "/login.html";
}

function authHeaders(){
    return{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + token
    }
}
async function loadScores(){
    scoreList.innerHTML = "";
    statusDisplay.textContent = "Loading Scores...";

    try {
        const res = await fetch("/api/highscores", {
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }

        const scores = await res.json();

        if (scores.length === 0) {
            statusDisplay.textContent = "No scores available";
            return;
        }

       
        scores.sort((a, b) => b.wins - a.wins);

        scores.forEach(score => {
            const li = document.createElement("li");
      
            li.textContent = `${score.screenname} - Score: ${score.score} - Wins: ${score.wins || 0}`;

            scoreList.appendChild(li);
        });

        statusDisplay.textContent = `Loaded ${scores.length} scores`;
    }
    catch (err) {
        statusDisplay.textContent = "Failed to load scores";
        console.error(err);
    }
}






document.getElementById("backBtn").addEventListener("click", ()=>{
    
    window.location.href = "/highscores.html";
})
loadScores();