fetch("/api/highscore",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({playername:"Jordan", score:1000, level:10})
})