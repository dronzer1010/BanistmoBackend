var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');

//Get Required Model

var User = require(__base + 'app/models/users');
var config = require(__base + 'app/config/database');

router.get('/' , function(req,res){
	res.send('This will retrun al users');
});

router.post('/register' , function(req,res){
	if(!req.body.username || !req.body.password){
		res.status(400).send({success : false , msg : "Invalid Parameters "});
	}else{
		var newUser = new User({
			username : req.body.username ,
			password : req.body.password,
			email    : (req.body.email)?req.body.email : null,
			phoneNumber :(req.body.phoneNumber)?req.body.phoneNumber:null,
			rank : req.body.rank
		});

		newUser.save(function(err,user){
			if(!err){
				res.status(200).send({success: true , data : user});
			}else{
				res.status(400).send({success: false , msg :err});
			}
		});
	}
});

router.post('/login' , function(req, res){
	if(!req.body.username || !req.body.password){
		res.status(400).json({
			success : false ,
			msg : "Invalid parameters"
		});
	}else{	
		User.findOne({username : req.body.username})
			.populate('rank')
			.exec(function(err , user){
			if (err) throw err;
         
            if (!user) {
              res.status(400).send({success: false, msg: 'Authentication failed. User not found.'});
            }else{
            	user.comparePassword(req.body.password , function(err , isMatch){
            		if(!err && isMatch){
            			var tokenData ={};
	                      tokenData._id = user._id;
	                      tokenData.username = user.email;
	                      tokenData.password = user.password;
	                      tokenData.userType = user.userType;
						  tokenData.rank     = user.rank;
	                    var token = jwt.encode(tokenData, config.secret);
            			res.status(200).json({success : true , data :{
            				id : user._id ,
							email : user.email,
            				userType : user.userType,
            				auth_token : 'JWT '+token
            			}});
            		}else{
            			res.status(400).send({success: false, msg: 'Authentication failed.Password do not match'});
            		}
            	});
            }
		});
	}
});


module.exports = router;