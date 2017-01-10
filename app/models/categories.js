var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Categories = new Schema({
	category : {
        type : String ,
        required : true ,
        unique : true
    },
    image : {
        type : String,
        
    }
},{
    timestamps: true
});



module.exports = mongoose.model('Categories', Categories);
