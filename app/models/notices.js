var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Notices = new Schema({
	title : {
        type:String,
        required : true ,
    },
    content : {
        type : String 
    },
    image : {
        type : String,
        required : true
    },
    date :{
        type:Date,
        default:Date.now()
    }
           
},{
    timestamps: true
});



module.exports = mongoose.model('Notices', Notices);