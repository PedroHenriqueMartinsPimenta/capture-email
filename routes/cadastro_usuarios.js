var express = require("express");
var categoriasModel = require('../model/categoria');
var usuarioModel = require("../model/usuario");
var bcrypt = require("bcrypt");
var passport = require('passport');
var routes = express.Router();

const nichos = ["Tecnologia da informação", "Animais e plantas", "Apps e softwares", "Casa e construção", "Culinária e gastronomia", "Desenvolvimento pessoal", "Design", "Direito", "Ecologia e meio ambiente","Educacional", "Entreterimento", "Esperitualidade", "Finanças e investimentos", "Hobbies", "Idiomas", "Internet", "Literatura", "Moda e beleza", "Música e artes", "Negócio e carreira", "Outros", "Relacionamentos", "Saúde e esportes", "Sexualidade"];

routes.get("/", function(req, res){
    categoriasModel.find().then(function(categorias){

        if(categorias.length == 0){
            nichos.forEach(function(nicho){
                console.log(nicho)
                var saveCategoria = new categoriasModel({
                    nome: nicho
                });
                saveCategoria.save();
            });
        }
        res.render("cadastro_usuarios", {categorias: categorias});
    }).catch(function(err){
        res.render("cadastro_usuarios", {categorias: null});
    });
});

routes.post("/", function(req, res, next){
    var dados = req.body;
    usuarioModel.find({email: dados.email}).then(function(user){
        if(user.length == 0){
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(dados.senha, salt, function(err, hash){
                    var saveUsuario = new usuarioModel({
                        email: dados.email,
                        nome: dados.nome,
                        sobrenome: dados.sobrenome,
                        numero: dados.numero,
                        facebook: dados.facebook,
                        instagram: dados.instagram,
                        youtube: dados.youtube,
                        twitter: dados.twitter,
                        pinterest: dados.pinterest,
                        senha: hash,
                        categoria: dados.nicho
                    });
                    saveUsuario.save().then(function(){
                        passport.authenticate("local", {
                            successRedirect:"/user",
                            failureRedirect:"/login",
                            failureFlash: true
                        })(req, res, next);
                    }).catch(function(err){
                        req.flash("message_error", "Error ao criar conta, por favor tente novamente mais tarde!");
                        res.redirect("/add/user");
                    });           
                });
            });
        }else{
            req.flash("message_error", "Email já cadastrado!");
            res.redirect("/add/user");
        }
    }).catch(function(err){
        req.flash("message_error", err);
        res.redirect("/add/user");
    });
});

module.exports = routes;