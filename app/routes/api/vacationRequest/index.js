var express  = require('express');
var mongoose = require('mongoose');
var moment   = require('moment');
var FCM      = require('fcm-push');
var mailer   = require('nodemailer');
var jwt      = require('jwt-simple');
var mg       = require('nodemailer-mailgun-transport');
var router   = express.Router();


//Get Required Model

var VacationRequest = require(__base + 'app/models/vacationRequest');
var MobileTokens = require(__base + 'app/models/mobileTokens');
var Vacation = require(__base + 'app/models/vacation');
var config = require(__base + 'app/config/database');


//  Setup fcm   
var fcm = new FCM(config.serverKey);

/**
 * POST route to create a vacation request
 */

router.post('/' , function(req,res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);

        if(decoded.userType == 'user'){
            if(!req.body.startsOn || !req.body.endsOn || !req.body.joinsOn || !req.body.reportsTo || !req.body.vacationType){
                return res.status(400).send({success: false, msg: 'Invalid Data'});
            }else{



                var tempStartDate = new Date(req.body.startsOn);
                var tempEndDate   = new Date(req.body.endsOn);
                var startDate = moment(tempStartDate);
                var endDate   = moment(tempEndDate);
                var noOfDays  = endDate.diff(startDate ,'days');


                console.log(req.body.startsOn);
                console.log(tempStartDate);
                console.log(startDate);
                console.log(endDate);
                console.log('No of days requested'+noOfDays);
                var newRequest = VacationRequest({
                    username : decoded.username,
                    userId   : decoded._id ,
                    startsOn : req.body.startsOn,
                    endsOn   : req.body.endsOn ,
                    joinsOn  : req.body.joinsOn ,
                    reportsTo : req.body.reportsTo,
                    vacationType : req.body.vacationType ,
                    noOfDays  : noOfDays, 
                    attachedDocuments : (req.body.file)?req.body.file : null

                });

                console.log(decoded);
                console.log(decoded.username);
                Vacation.findOne({username : decoded.username},function(err ,data){
                    if(!err){
                        console.log(data);
                        console.log('remaining days are '+data.daysRemaining);
                        var tempDays = data.daysRemaining - noOfDays;
                        if(parseInt(data.daysRemaining) >= parseInt(noOfDays)){
                            newRequest.save(function(err,vacData){
                                if(!err){
                                    Vacation.update({username : decoded.username},{$set:{daysRemaining : tempDays}},function(err,data){
                                        if(!err){
                                            MobileTokens.find({userId:decoded._id},function(err,user){
                                                if(!err){
                                                    var message = {
                                                        to: user.deviceToken , // required fill with device token or topics 
                                                        data: {
                                                            message: "Vacation request applied"
                                                        },
                                                        notification: {
                                                            title: 'Alert',
                                                            body: 'Vacation request applied'
                                                        }
                                                    };

                                                    fcm.send(message, function(err, response){
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            console.log( response);
                                                        }
                                                    });
                                                }else{
                                                    console.log('Device Token Not found');
                                                }
                                                return res.status(200).send({success: true, msg: "Vacation Requested"});
                                            });
                                            
                                        }else{
                                            console.log(err);
                                            return res.status(400).send({success: false, msg: err});
                                        }
                                    });
                                }else{
                                    console.log(err);
                                    return res.status(400).send({success: false, msg: err});
                                }
                            });
                        }else{
                            return res.status(200).send({success: false, msg: "No. of Vacations remaining is less than requested"});
                        }
                    }else{
                        console.log(err);
                        return res.status(400).send({success: false, msg: err});
                    }
                });
            }
        }else{
            return res.status(401).send({success: false, msg: 'User Token Invalid'});
        }

    }else{
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});


var devToken='cczrhzZvNJg:APA91bHxEdZ4fsojaaOp3dv5J2OkZHkHnNvh6jsdk7XyO-PLG6eKaSAMJIHwCznX9UokwAxF7AVZ2SnLE6_umvI5GsW3pC39rAVvnWE7oTqQ3p5dFbTDTHpRbv2XDD1vOkSunF_nYkw7';

router.get('/push' , function(req,res){
    var message = {
                          to:'/topics/585b9001e144967dd8e74d86', // required fill with device token or topics 
                          data: {
                              message: "Hello Hardik"
                          },
                          notification: {
                              title: 'Alert',
                              body: "Your are assistant manager"
                          }
                    };

       fcm.send(message, function(err, response){
                                                        if (err) {
                                                            console.log("err");
                                                            res.send(err);
                                                        } else {
                                                            console.log( response);
                                                            res.send(response);
                                                        }
                                                    });             
});




router.post('/mail' , function(req,res){
    var auth ={
        auth: {
            api_key: 'key-ad989efc0f727ed47307c63e7a768733',
           // user: 'sravik1010@gmail.com', // Your email id
           // pass: 'blueBayJersey1', // Your password
            domain : 'sandboxf918c011e52140cdb4065da23e2e0177.mailgun.org'
        }
    };
    var transporter = mailer.createTransport(mg(auth));


    var mailOptions = {
        from: 'postmaster@sandboxf918c011e52140cdb4065da23e2e0177.mailgun.org', // sender address
        to: 'amitpsri@gmail.com', // list of receivers
        subject: 'Sample mail', // Subject line
        text: "Hello From Ravi" //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead sent
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
});

var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};



module.exports = router;