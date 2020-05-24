var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/capture", { useNewUrlParser: true, useUnifiedTopology: true});
module.exports = mongoose;