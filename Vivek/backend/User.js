var db = require("./config");

var mongoose = require('mongoose');

// user --> email,password,secret

var Schema = mongoose.Schema;
 
var UserSchema = new Schema({
    email: String,
    password: String,
    secret: String,
});


module.exports = mongoose.model('User', UserSchema);