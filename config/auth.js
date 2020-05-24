var localStrategy = require('passport-local').Strategy;
var db = require('mongoose');
var bcrypt = require('bcrypt');
var Usuario = require('../model/usuario');
module.exports = function(passport){
    passport.use(new localStrategy({usernameField:"email", passwordField: "senha"}, function (email, senha, done){
        Usuario.findOne({email:email}).then(function(usuario){
            if(!usuario){
                return done(null, false, {message: "Esta conta não existe"});
            }

            bcrypt.compare(senha, usuario.senha, function(err, same){
                if(same){
                    return done(null, usuario);
                }else{
                    return done(null, false, {message: "Senha ou E-mail incorretos"});
                }
            });
        })
    }));

    passport.serializeUser(function(usuario, done){
        done(null, usuario.id);
    });

    passport.deserializeUser(function(id, done){
        Usuario.findById(id, function(err, usuario){
            done(err, usuario);
        });
    });
}