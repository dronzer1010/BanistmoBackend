var express  = require('express');
var mongoose = require('mongoose');
var multer   = require('multer');
var path     = require('path');
var router   = express.Router();
var xlsx = require('node-xlsx');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var config = require(__base + 'app/config/database');


/** Configure AWS */
aws.config.update({
    secretAccessKey:config.ac_main_secret,
    accessKeyId: config.ac_secret, 
});

/** Configure S3 bucket */
var s3 = new aws.S3();


/**
 * Images
 */
var upload =   multer({

    storage: multerS3({
        s3: s3,
        bucket: 'banistmo',
       
        key: function (req, file, cb) {
            console.log(file);
            cb(null, 'images/'+file.fieldname + '-' + Date.now()+path.extname(file.originalname)); //use Date.now() for unique file keys
        }
    })

}).single('image');

/**
 * Files
 */

var fileUpload =   multer({

    storage: multerS3({
        s3: s3,
        bucket: 'banistmo',
       
        key: function (req, file, cb) {
            console.log(file);
            cb(null, 'files/'+file.fieldname + '-' + Date.now()+path.extname(file.originalname)); //use Date.now() for unique file keys
        }
    })

}).single('file');





//var upload = multer({ storage : storage}).single('image');
//var fileUpload = multer({ storage : fileStorage}).single('file');


/**
 * POST route , adding rank
 */

router.post('/' , function(req, res , next){

       upload(req,res,function(err) {
            if(err) {
                console.log(err);
                return res.end("Error uploading file." , err);
            }else{
                
                //var  tempfile = req.file.path.split('/');
                res.status(200).send({
                    success : true ,
                    path:req.file.location
                });
            }
        });       
});



/**
 * Post route for file upload
 */

router.post('/file' , function(req, res , next){

       fileUpload(req,res,function(err) {
            if(err) {
                console.log(err);
                return res.end("Error uploading file." , err);
            }else{
                
                //var  tempfile = req.file.path.split('/');
                res.status(200).send({
                    success : true ,
                    path:req.file.location
                });
            }
        });     
});



module.exports = router;