var express = require('express');
var amostrasModel = require('../model/amostra');
var usuarioModel = require('../model/usuario');
var emailModel = require('../model/email');
var sendMail = require('../helpers/sendMail');
var routes = express.Router();

routes.get('/', function(req, res){
    res.redirect('/');
});
routes.get('/:id', function(req, res){
    amostrasModel.findById(req.params.id).then(function(amostra){
        usuarioModel.findById(amostra.usuario).then(function(autor){
            res.render('amostra', {amostra: amostra, autor: autor});
        });
    });
});

routes.post('/send/:id/:autor', function(req, res){
    var id = req.params.id;
    var autor = req.params.autor;
    var email = req.body.email;
    new emailModel({
        email: email,
        amostra: id,
        autor: autor
    }).save().then(function(){
        amostrasModel.findById(id).then(function(amostra){
            usuarioModel.findById(amostra.usuario).then(function(autor){
                var message = "Obrigado por solicitar o download do " + amostra.titulo + " \nLink para download: https://captureemail.herokuapp.com/"+amostra.link;
                sendMail(email, autor.email, amostra.titulo, message);
                res.redirect(amostra.redirect);
            }).catch(function(err){
                req.flash("message_error", "Error: " + err);
                res.redirect('/amostra/' + id);
            })
        }).catch(function(err){
            req.flash("message_error", "Error: " + err);
            res.redirect('/amostra/' + id);
        })
    }).catch(function(err){
        req.flash("message_error", "Error: " + err);
        res.redirect('/amostra/' + id);
    })
    
})

module.exports = routes;