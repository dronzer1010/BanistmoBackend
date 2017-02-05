var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BusinessUnits = new Schema({
    name : {
        type : String ,
        required : true ,
        unique : true
    }
    
},{
    timestamps: true
});



module.exports = mongoose.model('BusinessUnits', BusinessUnits);