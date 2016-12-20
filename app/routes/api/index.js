var express = require('express');
var router  = express.Router();

router.get('/' , function(req,res){
	res.send('api routes here');
});

router.use('/users' , require('./users'));
module.exports = router;