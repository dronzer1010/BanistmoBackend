var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Vacancy = new Schema({
	title :{
        type: String,
        required : true
    },
    description:{
        type:String ,
        required : true,
    },
    department : {
        type:Schema.Types.ObjectId,
        ref:'Departments',
        required:true
    },
    file :{
        type:String
    }
},{
    timestamps: true
});



module.exports = mongoose.model('Vacancy', Vacancy);
