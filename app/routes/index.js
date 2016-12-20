var express = require('express');
var router  = express.Router();

router.use('/api' ,require('./api'));

router.get('*' , function(req , res){
	res.send('not an api route');
});

module.exports =router;