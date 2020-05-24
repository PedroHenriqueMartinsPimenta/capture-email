var db = require("./db");
var Schema = db.Schema;

var email = new Schema({
    email: {
        type:String,
        required: true
    },
    momento:{
        type: Date,
        default: Date.now()
    },
    amostra:{
        type: Schema.Types.ObjectId,
        ref:"amostras",
        required: true
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    }
});

var emails = db.model("emails", email);

module.exports = emails;