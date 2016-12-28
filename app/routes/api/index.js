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


//events

router.get('/events' , function(req,res){
	res.status(200).send({
		success : true ,
		data : [{
			event : "New Year Eve Celebration" ,
			description : "Celebrating new year evening , all the employees are invited to join us in party.",
			startDate : new Date("12/30/2016"),
			endDate : new Date("01/01/2017"),
			status : "active"
		},{
			event : "Diwali Celebrations" ,
			description : "Celebrating Diwali , all the employees are invited to join us in party.",
			startDate : new Date("11/03/2016"),
			endDate : new Date("11/05/2016"),
			status : "active"
		},{
			event : "Founding Day Celebration" ,
			description : "Celebrating Founding Day , all the employees are invited to join us in party.",
			startDate : new Date("01/07/2017"),
			endDate : new Date("01/09/2017"),
			status : "active"
		}

		]
	})
});

module.exports = router;