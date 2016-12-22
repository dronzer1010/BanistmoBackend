var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Ranks = new Schema({
	rank : {
        type : String ,
        required : true ,
        unique : true
    }
},{
    timestamps: true
});



module.exports = mongoose.model('Ranks', Ranks);
