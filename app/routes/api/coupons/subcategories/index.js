var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var SubCat = require(__base + 'app/models/subcategories');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	SubCat.find({})
        .populate('category')
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
 * GET route , get subcategories by category
 */

router.get('/:id' , function(req, res){
    SubCat.find({category : req.params.id})
           .populate('category')
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
    if(!req.body.name || !req.body.category){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{
        var newSubCat  = new SubCat({
            name : req.body.name,
            category :  req.body.category,
            image : (req.body.image)?req.body.image:null
        });

        newSubCat .save(function(err , data){
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