var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://capture_email:captureemail12@cluster0-ce2nm.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
module.exports = mongoose;