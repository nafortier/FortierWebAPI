//Use Jsonwebtoken 
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//forces authentication 
module.exports = function requireAuth(req, res, next){
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");


    if(type !== "Bearer" || !token){
        return res.status(401).json({ok:false, error: "Missing Token"});
    }

    try{
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    }catch{
        return res.status(401).json({ok:false, error: "Invalid Token"});
    }
}