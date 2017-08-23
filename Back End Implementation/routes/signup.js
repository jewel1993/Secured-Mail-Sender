'use strict';
const mongojs   = require('mongojs');
const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');
var jwt = require('jsonwebtoken'); 
var  _ = require('lodash');
var config  = require('./config');
var dbroute  = require('./database');

exports.register = function(server, options, next) {

    const users = dbroute.gDb.collection('signup');
    const sendEmail = dbroute.gDb.collection('sendEmail');

    function createToken(user) {
        return jwt.sign({"username":user}, config.secret, { expiresIn: 60*60*5 });
    }

    server.route({ 
        method: 'POST',
        path: '/users',
        config: { auth: false },
        handler: function(request, reply) {

            const user = request.payload;
            console.log("\nSignup entry\n");

            if (!user.username || !user.password) {
                return reply("You must send the username and the password").code(400);
            }
            else
            {
                users.find({username : user.username} , function (err, docs) {
                    var length=docs.length;
                    //console.log(length); 
                    if(length!=0)
                    {
                        return reply("A user with that username already exists").code(400);
                    }
                    else
                    {
                        user._id = uuid.v1();
                        console.log(user);
                        users.save(user, (err, result) => {
                            if (err) {
                                return reply(Boom.badData('Internal MongoDB error', err));
                            }           
                            reply({id_token: createToken(user)}).code(201);
                        });
                    }
                });
            }    
        }
    });

    server.route({ 
        method: 'POST',
        path: '/sessions/create',
        config: { auth: false },
        handler: function(request, reply) {

            const user = request.payload;
            console.log("\nLogin entry\n");
            console.log(user.username , user.password); 

            if (!user.username || !user.password) {
                return reply("You must send the username and the password").code(400);
            }
            else
            {
                users.find({username : user.username} , function (err, docs) {
                    var length=docs.length;
                    console.log(docs); 
                    if(length==0)
                    {
                        return reply("User doesn't exist . ").code(400);
                    }
                    else
                    {
                            var pass=docs[0].password;
                            if(user.password!=pass)
                            {
                                return reply("PASSWORD DOESN'T MATCH , TRY AGAIN !!!").code(400);
                            }
                            else
                            {
                                reply({id_token: createToken(user)}).code(201);
                            }
                    }       
                });
            }    
        }
    });

    return next();
};
exports.register.attributes = {  
  name: 'signups'
};