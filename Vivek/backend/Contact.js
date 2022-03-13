var db = require("./config");
var mongoose = require('mongoose');
var User = require("./User")
var Schema = mongoose.Schema;
 
var ContactSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    user_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
});

module.exports = mongoose.model('Contacts', ContactSchema);