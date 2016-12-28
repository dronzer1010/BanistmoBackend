var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var Users = new Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName :{
        type : String
    },
	username : {
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
	phoneNumber : {
		type : String
	},
	isActive : {
		type : Boolean ,
		default : false
	} ,
    reportsTo:[{
        type:Schema.Types.ObjectId,
        ref:'Users',
    }], 
    department : {
        type:Schema.Types.ObjectId,
        ref:'Departments',
    },
    rank : {
        type:Schema.Types.ObjectId,
        ref:'Ranks',
        
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
