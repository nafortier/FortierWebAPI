const gameList = document.getElementById("gameList");
const statusDisplay = document.getElementById("status");
const form = document.getElementById("gameForm");

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
console.log("games =", games, typeof games);
        games.forEach(game => {
            const li = document.createElement("li");

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.type = "button";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.type = "button";

            

            //add func call
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

            li.textContent = `${game.gametitle} | `;

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


form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const gametitle = document.getElementById("gametitle").value;
    
    statusDisplay.textContent = "Submitting new game...";
    console.log("Form route");
    try{
        await fetch("/api/games", {
            method:"POST",
            headers:authHeaders(),
            body:JSON.stringify({gametitle})
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

document.getElementById("logoutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("token");
    window.location.href = "/secondpage.html";
})

loadGames();