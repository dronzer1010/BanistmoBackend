var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var Rank = require(__base + 'app/models/ranks');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	Rank.find({})
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
    if(!req.body.rank){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{
        var newRank  = new Rank({
            rank : req.body.rank
        });

        newRank .save(function(err , data){
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