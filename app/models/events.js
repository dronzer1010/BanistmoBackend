var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Events = new Schema({
	title : {
        type:String,
        required : true ,
    },
    description : {
        type : String 
    },
    startDate : {
        type:Date,
        default:Date.now()
    },
    EndDate :{
        type:Date,
        default:Date.now()
    },
    image :{
        type:String,
    
    },
    entrance:{
        type:String,
        required : true
    },
    to :{
        type:String,
        required : true
    }
           
},{
    timestamps: true
});



module.exports = mongoose.model('Events', Events);