var express = require('express');
var passport = require('passport');
var routes = express.Router();

routes.get('/', function(req, res){
    res.render('login');
});

routes.post("/", function(req, res, next){
    passport.authenticate("local", {
        successRedirect:"/user",
        failureRedirect: "/login",
        failureFlash:true
    })(req, res, next);
});
module.exports = routes;