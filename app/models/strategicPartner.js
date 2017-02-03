var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StrategicPartner = new Schema({
    name : {
        type : String ,
        required : true ,
        unique : true
    },
    email:{
        type:String,
        unique:true,
        required:true
    }
    
},{
    timestamps: true
});



module.exports = mongoose.model('StrategicPartner', StrategicPartner);
