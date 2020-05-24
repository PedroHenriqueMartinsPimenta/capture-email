var express = require('express');
var routes = express.Router();

routes.get("/", function(req, res){
    req.logOut();
    req.flash("message_success", "Logout com sucesso")
    res.redirect('/');
})

module.exports = routes;