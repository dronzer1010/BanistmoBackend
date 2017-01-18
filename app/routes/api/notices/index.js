var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var Notice = require(__base + 'app/models/notices');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	Notice.find({})
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
	Notice.find({_id:req.params.id})
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
    if(!req.body.title || !req.body.content || !req.body.image){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{



        var newNotice  = new Notice({
            title : req.body.title,
            image  : req.body.image ,
            content : req.body.content,
            date : req.body.date
        });

        newNotice .save(function(err , data){
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