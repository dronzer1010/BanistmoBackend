var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Subcategories = new Schema({
	name : {
        type : String ,
        required : true,
    },
    category : {
        type:Schema.Types.ObjectId,
        ref:'Categories',
        required : true ,
        
    },
    image : {
        type : String
    }
},{
    timestamps: true
});

Subcategories.index({ name: 1, categorie: 1}, { unique: true });


module.exports = mongoose.model('Subcategories', Subcategories);
