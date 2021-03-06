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
        required : false ,
    },
    image : {
        type : String
    },
    contact : {
        type:String
    },
    startDate : {
        type : String
    },
    description : {
        type:String
    },
    phone1 :{ 
        type:String
    },
    phone2 :{ 
        type:String
    },
    email : {
        type:String
    }

},{
    timestamps: true
});




module.exports = mongoose.model('Coupons', Coupons);
