const mongoose = require("mongoose")

const highScoreSchema = new mongoose.Schema(
    {
            userId:{type:String},
            screenname:{type:String, required:true, maxlength:24 },
            firstname:{type:String, required:true, maxlength:24 },
            lastname:{type:String, required:true, maxlength:24 },
            date:{type:String, required:true, maxlenght:64},
            score:{type:Number, required:true, min:0},
            wins:{type:Number, required:true, min:0}
    },
    {timestamps: true}
);

module.exports = mongoose.model("Game", highScoreSchema);