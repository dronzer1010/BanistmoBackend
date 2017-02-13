var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');

var multer   = require('multer');
var path     = require('path');
var xlsx = require('node-xlsx');
//Get Required Model

var User = require(__base + 'app/models/users');
var BU = require(__base + 'app/models/businessUnits');
var SP = require(__base + 'app/models/strategicPartners');
var Rank = require(__base + 'app/models/ranks');
var Departments = require(__base + 'app/models/departments');
var DM = require(__base + 'app/models/directManagers');
var JobGroup = require(__base + 'app/models/jobGroups');
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
	var populateQuery = [{path:'rank'},{path:'department'},{path:'businessUnit'},{path:'jobGroup'},{path:'strategicPartner'},{path:'directManager'}];
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



router.get('/:id' , function(req,res){
	var populateQuery = [{path:'rank'},{path:'department'},{path:'businessUnit'},{path:'jobGroup'},{path:'strategicPartner'},{path:'directManager'}];
	User.findOne({_id:req.params.id})
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

		var populateQuery =[{path:'rank'},{path:'department'},{path:'businessUnit'},{path:'jobGroup'},{path:'strategicPartner'},{path:'directManager'}];

		User.findOne({empId: req.body.empId})
			.populate(populateQuery)
			.exec(function(err , user){
			if (err) throw err;
         
            if (!user) {
              res.status(400).send({success: false, msg: 'Authentication failed. User not found.'});
            }else{

				console.log("device token is "+req.body.deviceToken);
            	user.comparePassword(req.body.password , function(err , isMatch){
            		if(!err && isMatch){
            			var tokenData ={};
	                      tokenData._id = user._id;
	                      tokenData.username = user.empId;
	                      tokenData.password = user.password;
						  
	                    var token = jwt.encode(tokenData, config.secret);
            			
						if(req.body.platformName && req.body.deviceToken){
							
							//Set and Update mobile token
							MobileTokens.update({userId : user._id},{userId : user._id , platformName : req.body.platformName , deviceToken : req.body.deviceToken},{upsert : true},function(err,data){
								if(!err){
									var t_topic = [user.rank._id ,user.department._id];
									console.log(t_topic);
									res.status(200).json({success : true , data :{
										id : user._id ,
										email : user.email,
										userType : user.userType,
										
										
										topic : t_topic,
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




					var syncFunc = function(index){
						if(index<num_rows){
							console.log(index);
							
							var excel_data = obj[0].data[index];
								
						var emp_id =excel_data[0];
						var emp_full_name = excel_data[1].split(',');
						var emp_firstName = emp_full_name[1];
						var emp_lastName = emp_full_name[0];
						var emp_email = (excel_data[2])?excel_data[2]:"";
						var emp_bu = excel_data[3];
						var emp_sp_name = excel_data[4];
						var emp_sp_email = excel_data[5];
						var emp_department = excel_data[6];
						var emp_cost_center = excel_data[7];
						var emp_rank = excel_data[8];
						var emp_jobgroup = excel_data[9];
						var emp_dm_name = excel_data[10];
						var emp_dm_email = excel_data[11];
						var emp_location = excel_data[12];
						var emp_startdate = excel_data[13];
						var emp_birthdate = excel_data[14];
						var emp_vacation = excel_data[15];

						SP.findOne({name : emp_sp_name},function(err , strategic_p){
							if(!err){
								if(strategic_p){
									console.log("Sp found");
									Departments.findOne({department:emp_department},function(err,department){
										if(!err){
											if(department){
												console.log("department  found");
												Rank.findOne({rank : emp_rank},function(err,rank){
													if(!err){
														if(rank){
															console.log("rank found");
															JobGroup.findOne({name : emp_jobgroup},function(err,jobgroup){
																if(!err){
																	if(jobgroup){
																		console.log("Jobj Group found");
																		if(emp_dm_name){
																			DM.findOne({name : emp_dm_name},function(err,directmanager){
																				if(!err){
																					if(directmanager){

																						var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager : directmanager._id,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																					}else{
																						console.log("creating new direct manager");
																						var newDirectManager = new DM({
																							name : emp_dm_name,
																							email : emp_dm_email
																						});

																						newDirectManager.save(function(err,directmanager){
																							if(!err){
																								var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager : directmanager._id,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																							}else{	
																								console.log(err);
																							}
																						});
																					}
																				}else{
																					console.log("Error while finding Direct Manager");
																				}
																			});
																		}else{
																			console.log("No Direct Manager");



																			var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager :null,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																		}
																	}else{
																		var newJobGroup = new JobGroup({
																			name : emp_jobgroup
																		});
																		newJobGroup.save(function(err, jobgroup){
																			if(emp_dm_name){
																			DM.findOne({name : emp_dm_name},function(err,directmanager){
																				if(!err){
																					if(directmanager){

																						var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager : directmanager._id,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																					}else{
																						console.log("creating new direct manager");
																						var newDirectManager = new DM({
																							name : emp_dm_name,
																							email : emp_dm_email
																						});

																						newDirectManager.save(function(err,directmanager){
																							if(!err){
																								var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager : directmanager._id,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																							}else{	
																								console.log(err);
																							}
																						});
																					}
																				}else{
																					console.log("Error while finding Direct Manager");
																				}
																			});
																		}else{
																			console.log("No Direct Manager");



																			var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager :null,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																		}
																		});
																	}


																}else{
																	console.log("Error while finding job group");
																}
															});
														}else{
															console.log("Rank Not found");

															var newRank = new Rank({
																rank : emp_rank
															});

															newRank.save(function(err,rank){
																if(!err){
																	JobGroup.findOne({name : emp_jobgroup},function(err,jobgroup){
																if(!err){
																	if(jobgroup){
																		console.log("Jobj Group found");
																		if(emp_dm_name){
																			DM.findOne({name : emp_dm_name},function(err,directmanager){
																				if(!err){
																					if(directmanager){

																						var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager : directmanager._id,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																					}else{
																						console.log("creating new direct manager");
																						var newDirectManager = new DM({
																							name : emp_dm_name,
																							email : emp_dm_email
																						});

																						newDirectManager.save(function(err,directmanager){
																							if(!err){
																								var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager : directmanager._id,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																							}else{	
																								console.log(err);
																							}
																						});
																					}
																				}else{
																					console.log("Error while finding Direct Manager");
																				}
																			});
																		}else{
																			console.log("No Direct Manager");



																			var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager :null,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																		}
																	}else{
																		var newJobGroup = new JobGroup({
																			name : emp_jobgroup
																		});
																		newJobGroup.save(function(err, jobgroup){
																			if(emp_dm_name){
																			DM.findOne({name : emp_dm_name},function(err,directmanager){
																				if(!err){
																					if(directmanager){

																						var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager : directmanager._id,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																					}else{
																						console.log("creating new direct manager");
																						var newDirectManager = new DM({
																							name : emp_dm_name,
																							email : emp_dm_email
																						});

																						newDirectManager.save(function(err,directmanager){
																							if(!err){
																								var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager : directmanager._id,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																							}else{	
																								console.log(err);
																							}
																						});
																					}
																				}else{
																					console.log("Error while finding Direct Manager");
																				}
																			});
																		}else{
																			console.log("No Direct Manager");



																			var newUser = new User({
																							empId : emp_id ,
																							firstName : emp_firstName ,
																							lastName : emp_lastName ,
																							email : emp_email ,
																							department : department._id ,
																							userType : 'user',
																							password:"abc123",
																							businessUnit : emp_bu,
																							rank : rank._id,
																							jobGroup:jobgroup._id,
																							strategicPartner : strategic_p._id,
																							personalLocation : emp_location,
																							startDate : emp_startdate,
																							birthDate : emp_birthdate,
																							costCenter : emp_cost_center,
																							vacationPending : emp_vacation,
																							directManager :null,
																							image : ""
																						});

																						newUser.save(function(err, user){
																							if(!err){
																								
																								console.log('User created');
																								syncFunc(index+1);
																							}else{
																								
																								console.log("Error while creating User");
																								console.log(err);
																							}
																						});
																		}
																		});
																	}


																}else{
																	console.log("Error while finding job group");
																}
															});
																}else{
																	console.log("Error while creating Rank");																}
															});

														}





													}else{
														console.log("Error while finding departments");
													}
												});
											}
										}else{
											console.log("Error while finding department ");
										}
									});
								}
							}else{
								console.log("Error while finding strategic Partner ");
							}
						});
						}
					};
					


					syncFunc(2);
					res.status(200).send({
						success : true ,
						msg: "All done"
					});

                
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