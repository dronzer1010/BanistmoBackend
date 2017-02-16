var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var VacancyRequest = new Schema({
	userDetail : {
        type:Schema.Types.ObjectId,
        ref:'Users',
    },
    userDocuments :[{
        type:String
    }],
    vacancyDetail : {
        type:Schema.Types.ObjectId,
        ref:'Vacancy',
    }
},{
    timestamps: true
});

VacancyRequest.index({userDetail: 1, vacancyDetail: 1 }, { unique: true });

module.exports = mongoose.model('VacancyRequest', VacancyRequest);
