var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MobileTokens = new Schema({
	userId : {
        type:Schema.Types.ObjectId,
        ref:'Users'
    },
    platformName : {
        type :  String,
        required : true
    },
    deviceToken : {
        type: String ,
        required : true
    }
},{
    timestamps: true
});



module.exports = mongoose.model('MobileTokens',MobileTokens);