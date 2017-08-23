var jwt = require('jsonwebtoken'); 
    config  = require('./config'),
    quoter  = require('./quoter');
const mongojs   = require('mongojs');
const Boom = require('boom');
const Joi = require('joi');
var protected_route1=require('./protected_route1.js');
var protected_route2=require('./protected_route2.js');
var dbroute  = require('./database');

const users = dbroute.gDb.collection('signup');

exports.register = function(server, options, next) {

          server.route([
              {
	            method: 'GET',
                path: '/api/protected/random-quote',
                config: { auth: 'jwt' },
                handler: protected_route1.getRandomQuote
              },
             { 
                method: 'POST',
                path: '/sendEmail',
                handler: protected_route2.sendEmail
                ,config: {
                    validate: {
                        payload: {
                            subject: Joi.string().max(50).required(),
                            message: Joi.string().max(50).required()
                                 }
                              }
                        }  
             }          
        ]);

return next();

};
exports.register.attributes = {  
  name: 'protected'
};