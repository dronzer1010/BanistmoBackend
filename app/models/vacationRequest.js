var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VacationRequest = new Schema({
	username : {
        type : String ,
        required : true ,
      
    },
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
    reportsTo : {
        type:Schema.Types.ObjectId,
        ref:'Users'
    },
    vacationType:{
        type : String,
        enum : ['vacation' , 'maternity' , 'sick'],
        default : 'vacation'
    },
    isApproved : {
        type : Boolean,
        default : false
    },
    attachedDocuments :{
        type:String
    },
    noOfDays :{
        type:Number,
        required : true
    }
},{
    timestamps: true
});



module.exports = mongoose.model('VacationRequest', VacationRequest);
