var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var Contact = require(__base + 'app/models/contacts');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	Contact.find({})
        .populate('designation')
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
    if(!req.body.name || !req.body.email || !req.body.designation){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{



        var newContact  = new Contact({
            name : req.body.name,
            image  : req.body.image ,
            email : req.body.email,
            designation : req.body.designation,
            phoneNumber :(req.body.phoneNumber)?req.body.phoneNumber : null
        });

        newContact .save(function(err , data){
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