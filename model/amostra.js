var db = require('./db');
var Schema = db.Schema;

var amostra = new Schema({
    titulo:{
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    button_text: {
        type: String,
        default: "Baixe agora"
    },
    redirect: {
        type: String,
        default: ""
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref:"usuarios",
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref:"categorias",
        required: true
    }
});

var amostras = db.model("amostras", amostra);

module.exports = amostras;