var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var NominationGroup= require(__base + 'app/models/nominationGroup');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
	NominationGroup.find({})
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
        var group  = new NominationGroup({
            category : req.body.category,
            
        });

        group.save(function(err , data){
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

        NominationGroup.update({_id:req.params.id},{$set : {
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
    

        NominationGroup.remove({_id:req.params.id},function(err,data){
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