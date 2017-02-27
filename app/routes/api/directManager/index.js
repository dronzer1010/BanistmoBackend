var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var DM = require(__base + 'app/models/directManagers');
var User = require(__base + 'app/models/users');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
    
	DM.find({})
        .exec(function(err , data){
             if(!err){
                res.status(200).send({
                    success : true ,
                    data : data
                });
            }else{
                res.status(400).send({
                    success :  false ,
                    msg : err
                });
            }
        });
});

router.get('/fix' , function(req,res){
    DM.find({})
        .exec(function(err,data){
            if(!err){
                data.forEach(function(item){
                    User.findOne({email:item.email},function(err,user){
                        if(!err){
                            DM.update({email:item.email},{$set:{empId:user.empId}},function(err,result){
                                if(!err){
                                    console.log("Empolyee updated");
                                }else{
                                    console.log("Employee not updated");
                                }
                            });
                        }
                    });
                });
            }else{

            }
        });
});




module.exports = router;
