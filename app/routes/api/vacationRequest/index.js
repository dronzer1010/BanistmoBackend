var express  = require('express');
var mongoose = require('mongoose');
var moment   = require('moment');
var FCM      = require('fcm-push');
var mailer   = require('nodemailer');
var jwt      = require('jwt-simple');
var mg       = require('nodemailer-mailgun-transport');
var router   = express.Router();
var helper = require('sendgrid').mail;

//Get Required Model

var VacationRequest = require(__base + 'app/models/vacationRequest');
var MobileTokens = require(__base + 'app/models/mobileTokens');
var Vacation = require(__base + 'app/models/vacation');
var config = require(__base + 'app/config/database');
var User = require(__base + 'app/models/users');

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
            console.log("Vacation Starts On "+req.body.startsOn);
            console.log("Vacation Ends On "+req.body.endsOn);
            console.log("Vacation Joins On "+req.body.joinsOn);
            console.log("Supervisor "+req.body.supervisor);
            console.log("Vacation Type "+req.body.vacationType);

            if(!req.body.startsOn || !req.body.endsOn || !req.body.joinsOn || !req.body.supervisor || !req.body.vacationType){
                return res.status(400).send({success: false, msg: 'Invalid Data'});
            }else{



                var tempStartDate = new Date(req.body.startsOn);
                var tempEndDate   = new Date(req.body.endsOn);
                var tempJoinsOn   = new Date(req.body.joinsOn);
                var startDate = moment(tempStartDate);
                var endDate   = moment(tempEndDate);
                var weekendDays = weekendDayCount(req.body.startsOn , req.body.endsOn);
                console.log("No of weekends Found is "+ weekendDays);
                var noOfDays  = endDate.diff(startDate ,'days');

                noOfDays = noOfDays-weekendDays;
                console.log(req.body.startsOn);
                console.log(tempStartDate);
                console.log(startDate);
                console.log(endDate);
                console.log('No of days requested'+noOfDays);
                var newRequest = VacationRequest({
                    userId   : decoded._id ,
                    startsOn : req.body.startsOn,
                    endsOn   : req.body.endsOn ,
                    joinsOn  : req.body.joinsOn ,
                    supervisor : req.body.supervisor,
                    vacationType : req.body.vacationType ,
                    noOfDays  : noOfDays, 
                    file : (req.body.file)?req.body.file : null

                });

                console.log(decoded);
                //console.log(decoded.username);
                if(tempJoinsOn.getDay()==0){

                }else{
                    User.findOne({_id : decoded._id},function(err ,data){
                    if(!err){
                        console.log(data);
                        console.log('remaining days are '+data.daysRemaining);
                        var tempDays = data.vacationPending - noOfDays;
                        if(parseInt(data.vacationPending) >= parseInt(noOfDays)){
                            newRequest.save(function(err,vacData){
                                if(!err){
                                    User.update({_id : decoded._id},{$set:{vacationPending : tempDays}},function(err,user){
                                        if(!err){
                                            User.findOne({_id:req.body.supervisor},function(err,supervisor){
                                                if(!err){
                                                    var from_email = new helper.Email('sravik1010@gmail.com');
                                                        var to_email = new helper.Email(supervisor.email);
                                                        var subject = 'Vacation Request';
                                                        var content = new helper.Content('text/plain', 'Hello '+supervisor.firstName+', '+data.firstName+' '+data.lastName+' is asking for vacation.');
                                                        var mail = new helper.Mail(from_email, subject, to_email, content);


                                                        var sg = require('sendgrid')(config.mail_key);
                                                        var request = sg.emptyRequest({
                                                        method: 'POST',
                                                        path: '/v3/mail/send',
                                                        body: mail.toJSON(),
                                                        });
                                                        sg.API(request, function(error, response) {
                                                            res.status(200).send({success :true , data : response});
                                                            //res.status(200).send({success : true , msg : "Co Manager Created"});   
                                                    });
                                                }else{

                                                }
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
            }
        }else{
            return res.status(401).send({success: false, msg: 'User Token Invalid'});
        }

    }else{
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});


var devToken='fnpv4ZGYITU:APA91bG-saSVcK7jFRnxkWNOvn7WObSC97hEUVJmI3O1e0uinASNVvLk3ipTpfDtjE3-l_q9Ez2dEEhe0nLBQcCz6p2Z2CzJHVPqVQDxbbKFuVUJwoLiX3DtvATP78UYijm28-kzhy3h';


router.post('/push' , function(req,res){
    var username_t=req.body.username;
    User.findOne({empId:username_t},function(err,data){
        if(!err){
            MobileTokens.find({userId:data._id},function(err,token){
                    if(!err){
                        var message = {
                            to:token.deviceToken, // required fill with device token or topics 
                            data: {
                                message: "Sample Push Notification"
                            },
                            notification: {
                                title: 'Alert',
                                body: "Pushed Message"
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


function CalculateWeekendDays(fromDate, toDate){
    var weekendDayCount = 0;
    var fromDate2 = new Date(fromDate);
    var toDate2 = new Date(toDate);
    while(fromDate2 < toDate2){
        fromDate2.setDate(fromDate2.getDate() + 1);
        if(fromDate2.getDay() === 0 || fromDate2.getDay() == 6){
            ++weekendDayCount ;
        }
    }

    return weekendDayCount ;
}

module.exports = router;