var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vish', { useNewUrlParser: true });
var connection = mongoose.connection;
connection.on('connected', function() {
    console.log('connected successfully to db');
});
connection.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
connection.on('error', console.error.bind(console, 'connection error:'));
module.exports = connection; 