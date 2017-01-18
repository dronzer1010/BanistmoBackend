var express = require('express');
var router  = express.Router();

router.get('/' , function(req,res){
	res.send('api routes here');
});

//Users Routes here
router.use('/users' , require('./users'));

//Ranks Routes here
router.use('/ranks' , require('./ranks'));

//Coupons Routes
router.use('/coupons' , require('./coupons'));

//Upload Routes
router.use('/upload' , require('./upload'));

//Circulars
router.use('/circulars' , require('./circulars'));

//notices
router.use('/notices' , require('./notices'));


//contacts
router.use('/contacts' , require('./contacts'));

//departments
router.use('/departments' , require('./departments'));

//vacation request

router.use('/vacationreq', require('./vacationRequest'));

//events

router.use('/events' , require('./events'));





module.exports = router;