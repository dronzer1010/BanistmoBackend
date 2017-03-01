var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DirectManagers = new Schema({
    name : {
        type : String ,
        required : true ,
        unique : true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    empId :{
        type:String
    },
    department : {
        type:Schema.Types.ObjectId,
        ref:'Departments',
    }
    
},{
    timestamps: true
});



module.exports = mongoose.model('DirectManagers', DirectManagers);
