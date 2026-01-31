const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema(
    {
            gametitle:{type:String, required:true, maxlength:24 }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Game", gameSchema);