const form = document.getElementById("editForm");
const cancelBtn = document.getElementById("cancelBtn");
const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if(!token){
    window.location.href = "/login.html";
}


async function loadScore(){
    const res = await fetch(`/api/highscores/${encodeURIComponent(id)}`, {headers:{"Authorization":"Bearer " + token}})
    if(res.status === 401){
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }
    const score = await res.json();

    document.getElementById("screenname").value = score.screenname ?? "";
    document.getElementById("firstname").value = score.firstname ?? "";
    document.getElementById("lastname").value = score.lastname ?? "";
    document.getElementById("date").value = score.date ?? "";
    document.getElementById("score").value = score.score ?? 0;
    document.getElementById("wins").value = score.wins ?? 0;
}


form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const screenname = document.getElementById("screenname").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const date = document.getElementById("date").value.trim();
    const score = Number(document.getElementById("score").value);
    const wins = Number(document.getElementById("wins").value);

    const res = await fetch(`/api/highscores/${encodeURIComponent(id)}`, {
        method:"PUT",
        headers:{"Content-Type":"application/json","Authorization":"Bearer " + token},
        body:JSON.stringify({screenname,firstname,lastname,date,score,wins}),
    });

    window.location.href = "/highscores.html";
});


cancelBtn.addEventListener("click", ()=>{
      window.location.href = "/highscores.html";
});
loadScore();