var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var Category = require(__base + 'app/models/categories');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	Category.find({})
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
    if(!req.body.category){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{
        var newCategory  = new Category({
            category : req.body.category,
            image : (req.body.image)?req.body.image:null
        });

        newCategory.save(function(err , data){
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