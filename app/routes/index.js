var express = require('express');
var router  = express.Router();

router.use('/api' ,require('./api'));
router.use('/images', express.static(__base + 'uploads'));

router.get('*' , function(req , res){
	res.send('not an api route');
});

module.exports =router;