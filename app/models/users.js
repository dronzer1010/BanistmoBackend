var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var Users = new Schema({
    firstName : {
        type : String,
        //required : true,
    },
    lastName :{
        type : String
    },
	empId : {
		type : String ,
		required :  true ,
		unique : true
	} ,
    userType:{
        type : String,
        enum : ['admin' , 'user'],
        default : 'user'

    },
	password : {
		type : String ,
		required : true
	} ,
	email : {
		type : String ,		
	},

    businessUnit:{
        type:Schema.Types.ObjectId,
        ref:'BusinessUnits',
    },
    strategicPartner:{
        type:Schema.Types.ObjectId,
        ref:'StrategicPartners',
    },
    directManager:{
        type:Schema.Types.ObjectId,
        ref:'DirectManagers',
    },

	isActive : {
		type : Boolean ,
		default : false
	} ,
    personalLocation:{
        type:String
    },
    startDate:{
        type:String
    },
    birthDate:{
        type:String
    },
    department : {
        type:Schema.Types.ObjectId,
        ref:'Departments',
    },
    rank : {
        type:Schema.Types.ObjectId,
        ref:'Ranks',
        
    },
    costCenter:{
        type:Number
    },
    jobGroup : {
        type:Schema.Types.ObjectId,
        ref:'JobGroups',
        
    },
    vacationPending:{
        type:Number
    },
    image : {
        type : String
    }

},{
    timestamps: true
});

Users.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
Users.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Users', Users);
