var express  = require('express');
var mongoose = require('mongoose');
var multer   = require('multer');
var path     = require('path');
var router   = express.Router();
var xlsx = require('node-xlsx');

/**
 * Images
 */
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __base + 'uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
});

/**
 * Files
 */
var fileStorage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __base + 'uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
});




var upload = multer({ storage : storage}).single('image');
var fileUpload = multer({ storage : storage}).single('file');


/**
 * POST route , adding rank
 */

router.post('/' , function(req, res , next){

       upload(req,res,function(err) {
            if(err) {
                console.log(err);
                return res.end("Error uploading file." , err);
            }else{
                var  tempfile = req.file.path.split('/');
                res.status(200).send({
                    success : true ,
                    path : 'file/'+req.file.filename
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
                var  tempfile = req.file.path.split('/');

                if(req.file.mimetype == "application/vnd.ms-excel" || req.file.mimeType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

                    var obj = xlsx.parse(__base + 'uploads/'+req.file.filename);
                    console.log(obj[0].data[0]);
                }                

                res.status(200).send({
                    success : true ,
                    path : 'file/'+req.file.filename,
                    documentType :req.file.mimetype
                });
            }
        });       
});



module.exports = router;