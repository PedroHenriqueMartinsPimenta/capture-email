module.exports = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("message_error", "Faça o login para ter acesso!");
    res.redirect("/login");
}