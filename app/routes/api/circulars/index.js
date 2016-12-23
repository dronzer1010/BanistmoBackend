var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var Circular = require(__base + 'app/models/circulars');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	Circular.find({})
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
    if(!req.body.title || !req.body.path || !req.body.documentType){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{
        var newCircular  = new Circular({
            title : req.body.title,
            path  : req.body.path ,
            description : req.body.description,
            documentType : req.body.documentType
        });

        newCircular .save(function(err , data){
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