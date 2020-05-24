var express = require('express');
var multer = require("multer");
var bcrypt = require('bcrypt');
var isLogin = require('../helpers/isLogin');
var categoriaModel = require('../model/categoria');
var amostraModel = require('../model/amostra');
var emailModel = require('../model/email');
var usuarioModel = require('../model/usuario');
var routes = express.Router();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
   
var upload = multer({ storage: storage })
 
routes.get("/", isLogin, function(req, res){
    emailModel.find({autor:req.user.id}).sort({momento: "desc"}).then(function(emails){
        res.render('user', {emails: emails});
    }).catch(function(err){
        req.flash("message_error", "Error: " + err);
        res.redirect('/');
    });
});

routes.get('/amostras', isLogin, function(req, res){
    amostraModel.find({usuario: req.user._id}).then(function(amostras){
        res.render('amostras', {amostras: amostras});
    })
});
routes.get('/amostras/add', isLogin,function(req, res){
    categoriaModel.find().then(function(categorias){
        res.render('create_amostra', {categorias: categorias});
    })
});
routes.post("/amostras/add", isLogin, upload.fields([{name: "img"}, {name: "amostra"}]),function(req, res){
    var amostraLink = req.files.amostra[0].path.replace("public", "");
    var imageLink = req.files.img[0].path.replace("public", "");
    var dados = req.body;
    new amostraModel({
        titulo: dados.titulo,
        descricao: dados.descricao,
        image: imageLink,
        link: amostraLink,
        button_text: dados.button_text,
        redirect: dados.redirect,
        usuario: req.user._id,
        categoria: dados.categoria
    }).save().then(function(){
        req.flash("message_success", "Cadastrado com sucesso!");
        res.redirect('/user/amostras/add');
    }).catch(function(err){
        req.flash("message_error", "Error: " + err);
        res.redirect('/user/amostras/add');        
    })
});

routes.get("/amostras/delete/:id", isLogin, function(req, res){
    amostraModel.deleteOne({_id: req.params.id}).then(function(){
        req.flash("message_success", "Removido com sucesso!");
        res.redirect('/user/amostras');
    }).catch(function(err){
        req.flash("message_error", "Error: " + err);
        res.redirect('/user/amostras');
    });
});

routes.get('/account', isLogin, function(req, res){
    usuarioModel.findById(req.user.id).then(function(dados){
        categoriaModel.find().then(function(categorias){
            res.render('edit_account', {dados: dados, categorias: categorias});
        }).catch(function(err){
            req.flash("message_error", err);
            res.redirect('/user');
        })
    }).catch(function(err){
        req.flash("message_error", err);
        res.redirect('/user');
    });
});

routes.post('/edit', isLogin, function(req, res){
    var dados = req.body;
    var filter = {
        _id: req.user.id
    }
    var update = {
        nome: dados.nome,
        sobrenome: dados.sobrenome,
        email: dados.email,
        numero: dados.numero,
        facebook: dados.facebook,
        instagram:  dados.instagram,
        youtube: dados.youtube,
        twitter: dados.twitter,
        pinterest: dados.pinterest,
        categoria: dados.nicho
    }
    usuarioModel.findByIdAndUpdate(filter, update, {new : true}).then(function(){
        req.flash("message_success", "Dados atualizados com sucesso!");
        res.redirect('/user/account');
    }).catch(function(err){
        req.flash("message_error", err);
        res.redirect('/user/account');
    });
});

routes.post('/password', isLogin, function(req, res){
    var dados = req.body;
    bcrypt.compare(dados.senha, req.user.senha, function(err, same){
        if(err){
            req.flash("message_error", err);
            res.redirect('/user/account');
        }
        
        if(same){
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(dados.newsenha, salt, function(err, hash){
                    usuarioModel.findByIdAndUpdate({_id: req.user.id}, {senha: hash}, {new: true}).then(function(){
                        req.user.senha = hash;
                        req.flash("message_success", "Senha atualizada com sucesso!");
                        res.redirect('/user/account');
                    }).catch(function(err){
                        req.flash("message_error", err);
                        res.redirect('/user/account');
                    });
                });
            });
        }else{
            req.flash("message_error", "Senha incorreta");
            res.redirect('/user/account');
        }
    })
});

module.exports = routes;