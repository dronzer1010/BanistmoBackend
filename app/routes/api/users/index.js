var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');

var multer   = require('multer');
var path     = require('path');
var xlsx = require('node-xlsx');
//Get Required Model

var User = require(__base + 'app/models/users');
var Vacation = require(__base + 'app/models/vacation');
var MobileTokens = require(__base + 'app/models/mobileTokens');
var config = require(__base + 'app/config/database');


//User File Upload
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __base + 'uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
});

var fileUpload = multer({ storage : storage}).single('file');





router.get('/' , function(req,res){
	var populateQuery = [{path:'rank'},{path:'department'},{path:'reportsTo'}];
	User.find({})
		.populate(populateQuery)
		.exec(function(err,users){
			if(!err){
						res.status(200).send({success: true , data : users});
					}else{
						res.status(400).send({success: false , msg :err});
					}
		});
});

router.post('/register' , function(req,res){
	if(!req.body.username || !req.body.password){
		res.status(400).send({success : false , msg : "Invalid Parameters "});
	}else{

		//create user instance
		var newUser = new User({
			username : req.body.username ,
			password : req.body.password,
			email    : (req.body.email)?req.body.email : null,
			phoneNumber :(req.body.phoneNumber)?req.body.phoneNumber:null,
			rank : req.body.rank,
			department:req.body.department,
			reportsTo : (req.body.reportsTo)?req.body.reportsTo:[],
			firstName : req.body.firstName,
			lastName : (req.body.lastName)?req.body.lastName:" ",
		});


		//create vacation instance

		var newUserVacation = new Vacation({
			username: req.body.username,
			daysRemaining : (req.body.vacation)?req.body.vacation : 15
		});



		newUser.save(function(err,user){
			if(!err){
				newUserVacation.save(function(err ,data){
					if(!err){
						res.status(200).send({success: true , data : user});
					}else{
						res.status(400).send({success: false , msg :err});
					}
				});
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

		var populateQuery = [{path:'rank'},{path:'department'},{path:'reportsTo'}];

		User.findOne({username : req.body.username})
			.populate(populateQuery)
			.exec(function(err , user){
			if (err) throw err;
         
            if (!user) {
              res.status(400).send({success: false, msg: 'Authentication failed. User not found.'});
            }else{

				console.log(user.username);
            	user.comparePassword(req.body.password , function(err , isMatch){
            		if(!err && isMatch){
            			var tokenData ={};
	                      tokenData._id = user._id;
	                      tokenData.username = user.username;
	                      tokenData.password = user.password;
	                      tokenData.userType = user.userType;
						  tokenData.rank     = user.rank.rank;
	                    var token = jwt.encode(tokenData, config.secret);
            			
						if(req.body.platformName && req.body.deviceToken){

							//Set and Update mobile token
							MobileTokens.update({userId : user._id},{userId : user._id , platformName : req.body.platformName , deviceToken : req.body.deviceToken},{upsert : true},function(err,data){
								if(!err){
									res.status(200).json({success : true , data :{
										id : user._id ,
										email : user.email,
										userType : user.userType,
										designation : user.rank.rank,
										department : user.department.department,
										topic : [user.rank._id ,user.department._id],
										auth_token : 'JWT '+token
									}});
								}else{
									res.status(200).json({success : true , data :{
										id : user._id ,
										email : user.email,
										userType : user.userType,
										auth_token : 'JWT '+token,
										msg : "Device token not set",
										err : err
									}});
								}
							});


						}else{
							res.status(200).json({success : true , data :{
								id : user._id ,
								email : user.email,
								userType : user.userType,
								auth_token : 'JWT '+token
							}});
						}
						
						
						
						
            		}else{
            			res.status(400).send({success: false, msg: 'Authentication failed.Password do not match'});
            		}
            	});
            }
		});
	}
});


router.post('/register/upload' ,function(req , res , next){
	fileUpload(req,res,function(err) {
            if(err) {
                console.log(err);
                return res.end("Error uploading file." , err);
            }else{
				var errorStatus = false;
                var  tempfile = req.file.path.split('/');
				if(req.file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || req.file.mimetype == "application/vnd.ms-excel"){
					var obj = xlsx.parse(__base + 'uploads/'+req.file.filename);

					var num_rows =obj[0].data.length;
					for(var i=1;i<num_rows;i++){
						var data_row = obj[0].data[i];
						//console.log(data_row);
						var newUser = new User({
							username: data_row[1],
							password : data_row[2],
							firstName : data_row[3],
							lastName : data_row[4],
							email : data_row[5],
							phoneNumber : data_row[6],
							reportsTo : data_row[7].split(','),
							department : data_row[8],
							rank : data_row[9],
						});

						//console.log(data_row[7].split(','));

						var newUserVacation = new Vacation({
							username: data_row[1],
							daysRemaining : 15
						});

						newUser.save(function(err , data){
							if(!err){
								newUserVacation.save(function(err,data){
									if(!err){
										console.log('User Created');
									}else{
										errorStatus = true;
										console.log("Error Has Occured");
									}
								});
							}else{
								console.log(err);
								errorStatus = true;
							}
						});
						

						

					
						
					}

					if(!errorStatus){
							res.status(200).send({
								success : true ,
								msg: "Data set created"
							});
						}else{
							res.status(200).send({
								success : false ,
								msg : "Error in data set creation"
							});
						}

                
				}else{
					res.status(200).send({
                    success : false ,
                    msg: "wrong file type"
                });
				}                

                
            }
        });
});


module.exports = router;