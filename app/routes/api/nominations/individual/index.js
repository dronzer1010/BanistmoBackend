var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var NominationIndi= require(__base + 'app/models/nominationIndividual');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	NominationIndi.find({})
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
        var indi  = new NominationIndi({
            category : req.body.category,
            
        });

        indi.save(function(err , data){
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

router.put('/:id' , function(req, res){
    if(!req.body.category){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{

        NominationIndi.update({_id:req.params.id},{$set : {
            category : req.body.category,
            
        }},function(err,data){
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
router.delete('/:id' , function(req, res){
    

        NominationIndi.remove({_id:req.params.id},function(err,data){
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



module.exports = router;