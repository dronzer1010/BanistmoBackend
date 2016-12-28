var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Departments = new Schema({
	department : {
        type : String ,
        required : true ,
        unique : true
    }
},{
    timestamps: true
});



module.exports = mongoose.model('Departments', Departments);
