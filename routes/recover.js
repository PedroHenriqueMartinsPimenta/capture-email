var express = require('express');
var usuarioModel = require('../model/usuario');
var bcrypt = require('bcrypt');
var email = require('../helpers/sendMail');
var routes = express.Router();

routes.get("/", function(req, res){
    res.render("recover");
});

routes.post("/code", function(req, res){
    var codigo = Math.round(Math.random() * 100000);
    email(req.body.email, "gocomprasdelivery", "Codigo de alteração de senha", "Codigo para alterar sua senha: " + codigo);
    req.session.code = codigo;
    res.render("code", {email: req.body.email});
});

routes.post("/code/:email", function(req, res){
    var codigo = req.body.code;
    if(req.session.code == codigo){
        res.render("edit_senha", {email: req.params.email});
    }else{
        req.flash("message_error", "Codigo invalido, tente novamente mais tarde!");
        res.redirect("/recover");
    }
});

routes.post("/edit/senha/:email", function(req, res){
    bcrypt.genSalt(10, function (err, salt){
        if(err){
            req.flash("message_error", "Error: "+err);
            res.redirect('/recover');
        } 

        bcrypt.hash(req.body.senha, salt, function(err, hash){
            if(err){
                req.flash("message_error", "Error: "+err);
                res.redirect('/recover');
            }
            var filter = {
                email: req.params.email
            }
            var update = {
                senha: hash
            }
            usuarioModel.findOneAndUpdate(filter, update, {new: true}).then(function(){
                req.flash('message_success', "Senha atualizada com sucesso!");
                res.redirect('/login');
            }).catch(function(err){
                req.flash("message_error", "Error: "+err);
                res.redirect('/recover');
            });
        });
    });
});

module.exports = routes;