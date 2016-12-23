var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Circulars = new Schema({
	title : {
        type:String,
        required : true ,
    },
    description : {
        type : String 
    },
    path : {
        type : String,
        required : true
    },
    documentType : {
        type : String,
        required : true
    }
},{
    timestamps: true
});



module.exports = mongoose.model('Circulars', Circulars);