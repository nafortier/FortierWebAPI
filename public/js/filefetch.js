const gameList = document.getElementById("gameList");
const statusDisplay = document.getElementById("status");


async function loadGames(){
    gameList.innerHTML = "";
    statusDisplay.textContent = "Loading Games...";

    try{
        const res = await fetch("/api/games");
        const games = await res.json();

        

        if(games.length === 0){
            statusDisplay.textContent = "No games available";
            return;
        }
            console.log("games =", games, typeof games);
            games.forEach(game => {
            const li = document.createElement("li");

           

            

        

            li.textContent = `${game.gametitle} | `;

           
            gameList.appendChild(li);
        });

        statusDisplay.textContent = `Loaded ${games.length} games`;
    }
    catch(err){
        console.log(err);
        statusDisplay.textContent = "Failed to load games"
    }
}




loadGames();