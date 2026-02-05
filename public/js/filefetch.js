
// FETCH FOR THE MAIN PAGE
const gameList = document.getElementById("gameList");
const statusDisplay = document.getElementById("status");


const token = localStorage.getItem("token");

if(!token){
    //WILL NOT SHOW ENTRIES IF NOT LOGGED IN
    statusDisplay.textContent = "Not Logged In"
}
async function loadGames(){
    gameList.innerHTML = "";
    statusDisplay.textContent = "Loading Games...";
    if(!token){
    statusDisplay.textContent = "Not Logged In"
    } else{

    try{
        const res = await fetch("/api/games", {headers:{"Authorization":"Bearer " + token}});
        const games = await res.json();

        

        if(games.length === 0){
            statusDisplay.textContent = "No games available";
            return;
        }
            console.log("games =", games, typeof games);
            games.forEach(game => {
            const li = document.createElement("li");

           

            //loop through each game and list the fields

            li.textContent = `${game.gametitle} | ${game.developer}`;

           
            gameList.appendChild(li);
        });

        statusDisplay.textContent = `Loaded ${games.length} games`;
    }
    catch(err){
        
        console.log(err);
        statusDisplay.textContent = "Failed to load games"
    }
    }
}




loadGames();