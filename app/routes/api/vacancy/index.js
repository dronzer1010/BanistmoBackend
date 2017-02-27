var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();


//Get Required Model

var Vacancy = require(__base + 'app/models/vacancy');

/**
 * GET route , get all routes
 */

router.get('/' , function(req,res){
    var populateQuery = [{path:'department'}];
	Vacancy.find({})
        .populate(populateQuery)
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
 * GET route , get by id routes
 */
router.get('/:id' , function(req,res){
	Vacancy.find({_id : req.params.id})
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
    if(!req.body.title || !req.body.department ||!req.body.description ){
        // Rank parameter  not found
        res.status(400).send({
            success : false ,
            msg : "Invalid Parameters"
        });
    }else{
        var newvacancy  = new Vacancy({
            title : req.body.title,
            description : req.body.description,
            department : req.body.department,
            file : req.body.file
      
        });

        newvacancy.save(function(err , data){
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


router.put('/:id' , function(req,res){
	Vacancy.update({_id : req.params.id} , {
		$set : {
			title : req.body.title ,
			description : req.body.description,
            file : req.body.file,
            department : req.body.department
		}
	},function(err ,data){
		if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
	});
});

router.delete('/:id' , function(req,res){
	Vacancy.remove({_id : req.params.id} ,function(err ,data){
		if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
	});
});

module.exports = router;
