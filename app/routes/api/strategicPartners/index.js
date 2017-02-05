var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var SP = require(__base + 'app/models/strategicPartners');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	SP.find({})
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
    if(!req.body.name || !req.body.email){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{
        var newSP  = new SP({
            name : req.body.name,
            email : req.body.email
      
        });

        newSP.save(function(err , data){
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