var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Vacation = new Schema({
	username : {
        type : String ,
        required : true ,
        unique : true
    },
    daysRemaining : {
        type : Number ,
        required : true,
        default : 15   
    }
},{
    timestamps: true
});



module.exports = mongoose.model('Vacation', Vacation);
