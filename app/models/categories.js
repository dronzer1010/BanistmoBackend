var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Categories = new Schema({
	category : {
        type : String ,
        required : true ,
        unique : true
    }
},{
    timestamps: true
});



module.exports = mongoose.model('Categories', Categories);
