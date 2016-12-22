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
        contacts : req.body.contacts,
        category : req.body.category,
        subcategory : req.body.subcategory ,
        image : req.body.image
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
module.exports = router;

