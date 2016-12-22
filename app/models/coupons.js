var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Coupons = new Schema({
	title : {
        type : String ,
        required : true,
    },
    category : {
        type:Schema.Types.ObjectId,
        ref:'Categories',
        required : true ,
        
    },
    subcategory : {
        type:Schema.Types.ObjectId,
        ref:'Subcategories',
        required : true ,
    },
    image : {
        type : String
    },
    contacts : {
        type:String
    },
    startDate : {
        type : String
    }

},{
    timestamps: true
});




module.exports = mongoose.model('Coupons', Coupons);
