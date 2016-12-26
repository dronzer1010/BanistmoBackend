var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Contacts = new Schema({
	name : {
        type:String,
        required : true ,
    },
    email : {
        type : String,
        required : true 
    },
    image : {
        type : String,
        
    },
    phoneNumber : {
        type : String,
        
    },
    designation : {
        type:Schema.Types.ObjectId,
        ref:'Ranks',
        required : true
    }

           
},{
    timestamps: true
});



module.exports = mongoose.model('Contacts',Contacts);