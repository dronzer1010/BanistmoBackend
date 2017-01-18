var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var Event = require(__base + 'app/models/events');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	Event.find({})
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

router.get('/:id' , function(req,res){
	Event.findOne({_id:req.params.id})
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
    if(!req.body.title || !req.body.description || !req.body.startDate || !req.body.endDate || !req.body.to || !req.body.entrance){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{



        var newEvent  = new Event({
            title : req.body.title,
            image  : req.body.image ,
            description : req.body.description,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
            entrance : req.body.entrance,
            to : req.body.to
        });

        newEvent .save(function(err , data){
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