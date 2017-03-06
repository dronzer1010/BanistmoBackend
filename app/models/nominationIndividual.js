var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var NominationIndividual = new Schema({
	category : {
        type : String ,
        required : true ,
        unique : true
    },
    
},{
    timestamps: true
});



module.exports = mongoose.model('NominationIndividual', NominationIndividual);
