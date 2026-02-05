const form = document.getElementById("editForm");
const cancelBtn = document.getElementById("cancelBtn");
const token = localStorage.getItem("token");


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if(!token){
    window.location.href = "/login.html";
}

async function loadGame(){
    const res = await fetch(`/api/games/${encodeURIComponent(id)}`, {headers:{"Authorization":"Bearer " + token}})
    if(res.status === 401){
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }
    const game = await res.json();

    document.getElementById("gametitle").value = game.gametitle ?? "";

}


form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const gametitle = document.getElementById("gametitle").value.trim();

    
    const res = await fetch(`/api/games/${encodeURIComponent(id)}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json","Authorization":"Bearer " + token},
        body:JSON.stringify({gametitle}),
    });


    window.location.href = "/thirdpage.html";
});


cancelBtn.addEventListener("click", ()=>{
      window.location.href = "/thirdpage.html";
});
loadGame();