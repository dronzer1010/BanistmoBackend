var express = require('express');
var router  = express.Router();

var Coupon = require(__base + 'app/models/coupons');

//Categories
router.use('/categories' , require('./categories'));

//Sub-Categories
router.use('/subcategories' , require('./subcategories'));

router.post('/' ,function(req,res){
    var newCoupon = new Coupon({
        title : req.body.title ,
        description : req.body.description,
        startDate : req.body.date ,
        contact : req.body.contact,
        category : req.body.category,
        //subcategory : req.body.subcategory ,
        image : req.body.image,
        phone1 : req.body.phone1,
        phone2 : req.body.phone2,
        email:req.body.email
    });

    newCoupon.save(function(err,data){
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

router.get('/' , function(req,res){
    Coupon.find({})
            .exec(function(err,data){
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
    Coupon.find({_id:req.params.id})
            .exec(function(err,data){
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




router.put('/:id' ,function(req,res){

    Coupon.update({_id:req.params.id},{$set:{
       title : req.body.title ,
        description : req.body.description,
        startDate : req.body.date ,
        contact : req.body.contact,
        category : req.body.category,
        //subcategory : req.body.subcategory ,
        image : req.body.image,
        phone1 : req.body.phone1,
        phone2 : req.body.phone2,
        email:req.body.email 
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


});


router.delete('/:id' , function(req,res){
    Coupon.remove({_id:req.params.id})
            .exec(function(err,data){
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

