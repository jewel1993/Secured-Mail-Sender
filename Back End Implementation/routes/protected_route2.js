const uuid = require('node-uuid');  
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
const mongojs   = require('mongojs');
var dbroute  = require('./database');

const mails = dbroute.gDb.collection('sendEmail');

exports.sendEmail = function(request, reply) {
                    const mail = request.payload;
                    console.log("\nProtected Sendmail entry\n");

                    //Create an id
                    mail._id = uuid.v1();
                    console.log(mail);
                    mails.save(mail, (err, result) => {

                        if (err) {
                            return reply(Boom.badData('Internal MongoDB error', err));
                        }    

                        //

                        //defining transporter
                        var transporter = nodemailer.createTransport({
                            transport: 'ses', // loads nodemailer-ses-transport
                            accessKeyId: '********************',
                            secretAccessKey: '**************************************',
                            region: '***********'
                        });

                        var sub=mail.subject;
                        var msg=mail.message;

                        // setup e-mail data with unicode symbols
                        var mailOptions = {
                            from: '*************************', // sender address
                            to: ['********************','******************************'], // list of receivers
                            subject: sub, // Subject line
                            html: msg  
                            //JSON.stringify(mail)  <- to send JSON
                        };

                        // send mail with defined transport object

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                return console.log(error);
                            }
                            console.log('Message sent: ' + JSON.stringify(info));
                        });
      
                        //                  
      
                        reply('Mail successfully sent');
                    })
}
