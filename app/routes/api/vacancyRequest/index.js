var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');
var config = require(__base + 'app/config/database');
//Get Required Model

var VacancyReq = require(__base + 'app/models/vacancyRequest');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
    	var populateQuery = [{path:'userDetail'},{path:'vacancyDetail'},{path:'department'}];

	if(req.query.jobId && req.query.userId&&req.query.departmentId){
        console.log("Both query");
        VacancyReq.find({userDetail:req.query.userId , vacancyDetail : req.query.jobId,department:departmentId})
                    .populate(populateQuery)
                    .exec(function(err,data){
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
        if(req.query.departmentId){
            VacancyReq.find({department:req.query.departmentId })
                    .populate(populateQuery)
                    .exec(function(err,data){
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
        }
        if(req.query.jobId){
            console.log("Job query");

            VacancyReq.find({vacancyDetail : req.query.jobId})
                    .populate(populateQuery)
                    .exec(function(err,data){
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
            if(req.query.userId){
                console.log("user Query");
                VacancyReq.find({userDetail:req.query.userId })
                    .populate(populateQuery)
                    .exec(function(err,data){
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
                console.log("No query");
                VacancyReq.find({})
                    .populate(populateQuery)
                    .exec(function(err,data){
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
            }
        }
        

    }
});


router.get('/status',function(req,res){
    if(!req.query.userId || !req.query.vacancyId){
        res.status(400).send({
                                success :  false ,
                                msg : "Invalid Request Parameters"
                            });
    }else{
        VacancyReq.find({userDetail:req.query.userId , vacancyDetail : req.query.vacancyId},function(err,data){
            if(!err){
                if(!data){
                    res.status(400).send({
                                success :  true ,
                                status : false
                            });
                }else{
                    res.status(400).send({
                                success :  true ,
                                status : true
                            });
                }
            }else{
                res.status(400).send({
                                success :  false ,
                                msg : err
                            });
            }
        });
    }
});


/**
 * POST route , adding rank
 */

router.post('/' , function(req, res){
    var token = getToken(req.headers);
    if(token){
        var decoded = jwt.decode(token, config.secret);
        console.log(req.body.vacancy);
        console.log(token);
        var newRequest = new VacancyReq({
            userDetail : decoded._id,
            vacancyDetail : req.body.vacancy,
            userDocuments : req.body.documents 
        });

        newRequest.save(function(err,data){
            if(!err){
                return res.status(200).send({success:true,data: data});
            }else{
                 console.log(err);
                return res.status(400).send({success: false, msg: err});
            }
        });
    }else{
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
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