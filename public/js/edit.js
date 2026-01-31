const form = document.getElementById("editForm");
const cancelBtn = document.getElementById("cancelBtn");


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadGame(){
    const res = await fetch(`/api/games/${encodeURIComponent(id)}`)

    const game = await res.json();

    document.getElementById("gametitle").value = game.gametitle ?? "";

}


form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const gametitle = document.getElementById("gametitle").value.trim();

    
    const res = await fetch(`/api/games/${encodeURIComponent(id)}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({gametitle}),
    });


    window.location.href = "/thirdpage.html";
});


cancelBtn.addEventListener("click", ()=>{
      window.location.href = "/thirdpage.html";
});
loadGame();