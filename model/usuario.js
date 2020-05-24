var db = require("./db");
var Schema = db.Schema;

var usuario = new Schema({
    email:{
        type: String,
        required: true
    },
    nome: {
        type:String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    facebook:{
        type: String,
        default: "http://facebook.com"
    },
    instagram:{
        type: String,
        default:"https://instagram.com"
    },
    youtube:{
        type:String,
        default: "https://youtube.com"
    },
    twitter:{
        type: String,
        default: "https://twitter.com"
    },
    pinterest:{
        type: String,
        default: "https://pinterest.com"
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    }

});

var usuarios = db.model("usuarios", usuario);

module.exports = usuarios;