//Functionality script for submitting games
const gameList = document.getElementById("gameList");
const statusDisplay = document.getElementById("status");
const form = document.getElementById("gameForm");

//get token
const token = localStorage.getItem("token");
if(!token){
    window.location.href = "/secondpage.html";
}

function authHeaders(){
    return{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + token
    }
}

//Load games and show games 
async function loadGames(){
    gameList.innerHTML = "";
    statusDisplay.textContent = "Loading Games...";

    try{
        const res = await fetch("/api/games", {headers:{"Authorization":"Bearer " + token}});
        if(res.status === 401){
            localStorage.removeItem("token");
            window.location.href = "/secondpage.html";
            return;
        }
        const games = await res.json();

        

        if(games.length === 0){
            statusDisplay.textContent = "No games available";
            return;
        }

        //Loop through the games and create edit and delete buttons
        games.forEach(game => {
            const li = document.createElement("li");

            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.type = "button";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.type = "button";

            

            //function call for the buttons
            deleteBtn.addEventListener("click", async ()=>{
                if(!confirm(`Delete ${game.gametitle}`)){
                    return; 
                }
                await deleteGame(game._id);
                loadGames();
            });

            editBtn.addEventListener("click", async ()=>{
                window.location.href = `/edit.html?id=${encodeURIComponent(game._id)}`
            });
            //list games
            li.textContent = `${game.gametitle} | ${game.developer} `;

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            gameList.appendChild(li);
        });

        statusDisplay.textContent = `Loaded ${games.length} games`;
    }
    catch(err){
        console.log(err);
        statusDisplay.textContent = "Failed to load games"
    }
}

//function cal for the submit button
form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const gametitle = document.getElementById("gametitle").value;
     const developer = document.getElementById("developer").value;
    
    statusDisplay.textContent = "Submitting new game...";
    console.log("Form route");
    try{
        await fetch("/api/games", {
            method:"POST",
            headers:authHeaders(),
            body:JSON.stringify({gametitle,developer})
        });

        form.reset()
        loadGames();
    }catch(err){
        console.log(err)
        statusDisplay.textContent = "Failed to submit game";
    }
});

async function deleteGame(id){
    statusDisplay.textContent = "Deleting...";

    const res = await fetch(`/api/games/${id}`, {method:"DELETE"});

    if(!res.ok){
        statusDisplay.textContent = "Delete failed";
    }

    statusDisplay.textContent = "Game Deleted.";
}


//function for logout button
document.getElementById("logoutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("token");
    window.location.href = "/secondpage.html";
})

loadGames();