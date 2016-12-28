var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var Department = require(__base + 'app/models/departments');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	Department.find({})
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

/**
 * POST route , adding rank
 */

router.post('/' , function(req, res){
    if(!req.body.department){
        // Rank parameter  not found!
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{
        var newDepartment  = new Department({
            department : req.body.department
        });

        newDepartment .save(function(err , data){
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
});




module.exports = router;