module.exports = function(to, from, subject, message){
    var nodemailer = require('nodemailer');
    var $usuario = 'gocomprasdelivery@gmail.com';
    var $senha = "gocompras12"; 
    
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: $usuario,
            pass: $senha
        }
    });
    
    
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}