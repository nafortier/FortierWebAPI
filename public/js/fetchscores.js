const scoreList = document.getElementById("scoreList");
const statusDisplay = document.getElementById("status");
const form = document.getElementById("scoreForm");

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

    try{
        const res = await fetch("/api/highscores", {headers:{"Authorization":"Bearer " + token}});
        if(res.status === 401){
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }
        const scores = await res.json();

        if(scores.length === 0){
            statusDisplay.textContent = "No scores available";
            return
        }

        scores.forEach(score => {
            const li = document.createElement("li");

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.type = "button";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.type = "button";

            

            //add func call
            deleteBtn.addEventListener("click", async ()=>{
                if(!confirm(`Delete ${score.screenname}'s score`)){
                    return; 
                }
                await deleteScore(score._id);
                loadScores();
            });

            editBtn.addEventListener("click", async ()=>{
                window.location.href = `/edit.html?id=${encodeURIComponent(score._id)}`
            });

            li.textContent = `${score.screenname} - Score: ${score.score} - Wins: ${score.wins} | `;

            li.appendChild(editBtn);
            //li.appendChild(deleteBtn);
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

    const screenname = document.getElementById("screenname").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const date = document.getElementById("date").value;
    const score = document.getElementById("score").value;
      const wins = document.getElementById("wins").value;
    statusDisplay.textContent = "Submitting new score...";
    console.log("Form route");
    try{
        await fetch("/api/highscores", {
            method:"POST",
            headers:authHeaders(),
            body:JSON.stringify({screenname,firstname,lastname,date,score,wins})
        });

        form.reset()
        loadScores();
    }catch(err){
        statusDisplay.textContent = "Failed to submit score";
    }
});

async function deleteScore(id){
    statusDisplay.textContent = "Deleting...";

    const res = await fetch(`/api/highscores/${id}`, {method:"DELETE"});

    if(!res.ok){
        statusDisplay.textContent = "Delete failed";
    }

    statusDisplay.textContent = "Score Deleted.";
}

document.getElementById("logoutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("token");
    window.location.href = "/login.html";
})
document.getElementById("winBtn").addEventListener("click", ()=>{
    
    window.location.href = "/wins.html";
})


loadScores();