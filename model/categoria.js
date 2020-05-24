var db = require('./db');
var Schema = db.Schema;

var categoria = new Schema({
    nome: {
        type: String,
        required: true
    }
});

var categorias = db.model("categorias", categoria);

module.exports = categorias;