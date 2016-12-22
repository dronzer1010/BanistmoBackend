var express  = require('express');
var mongoose = require('mongoose');
var multer   = require('multer');
var path     = require('path');
var router   = express.Router();

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __base + 'uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({ storage : storage}).single('image');


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
                    path : 'images/'+req.file.filename
                });
            }
        });    
            
      
   
});




module.exports = router;