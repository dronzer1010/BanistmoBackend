var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VacationRequest = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'Users'
    },
    startsOn :{
        type : Date,
        required : true
    },
    endsOn : {
        type : Date ,
        required : true,
    },
    joinsOn : {
        type : Date ,
        required : true
    },
    supervisor : {
        type:Schema.Types.ObjectId,
        ref:'Users'
    },
    vacationType:{
        type : String,
        enum : ['vacation' , 'maternity' , 'sick'],
        default : 'vacation'
    },
    approvalStatusSupervisor : {
        type:String,
        enum:['pending' , 'rejected' ,'accepted'],
        default : 'pending'
    },
    approvalStatusAdmin:{
        type:String,
        enum:['pending' , 'rejected' ,'accepted'],
        default : 'pending'
    },
    file :{
        type:String
    },
    noOfDays :{
        type:Number,
        required : true
    },

},{
    timestamps: true
});



module.exports = mongoose.model('VacationRequest', VacationRequest);
