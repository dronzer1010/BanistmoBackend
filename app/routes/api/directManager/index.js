var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

var jwt      = require('jwt-simple');
var config = require(__base + 'app/config/database');
//Get Required Model

var DM = require(__base + 'app/models/directManagers');
var User = require(__base + 'app/models/users');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
    var populateQuery = [{path:'department'}];
	DM.find({})
       .populate(populateQuery)
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
router.get('/my' , function(req,res){

    var populateQuery = [{path:'department'}];
    var token = getToken(req.headers);
    if(token){
        var decoded = jwt.decode(token, config.secret);
        console.log(token);
        User.findOne({_id:decoded._id},function(err,user){
            if(!err){
                if(user){
                    DM.find({department : user.department})
                        .populate(populateQuery)
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
                }else{
                    res.status(400).send({
                        success :  false ,
                        msg : "Invalid Token"
                    });
                }
            }else{
                res.status(400).send({
                    success :  false ,
                    msg : err
                });
            }
        });
    }else{
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }

    

});

router.get('/fix' , function(req,res){
    DM.find({})
        .exec(function(err,data){
            if(!err){
                data.forEach(function(item){
                    User.findOne({email:item.email},function(err,user){
                        if(!err){
                            DM.update({email:item.email},{$set:{department:user.department}},function(err,result){
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


var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
