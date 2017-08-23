var Hapi        = require('hapi');
const mongojs   = require('mongojs');
const mongoose = require('mongoose');
var JWT         = require('jsonwebtoken');  // used to sign our content
var port        = process.env.PORT || 3001; // allow port to be set
var config  = require('./routes/config');
var dbroute  = require('./routes/database');

var server = new Hapi.Server();
const users = dbroute.gDb.collection('signup');

var listOfRoutes = [require('./routes/signup'), require('./routes/anonymous-routes') , require('./routes/protected')];

server.connection({ port: port, routes: {cors: true} });
    
    var validate = function (decoded, request, callback) {
       const users = dbroute.gDb.collection('signup');
       console.log("validate entry"); 
       console.log(decoded);
       users.find({username : decoded.username} , function (err, docs) {
                    var length=docs.length;
                    console.log(docs); 
                    if(length!=0)
                    {
                                    console.log("found");
                                    return callback(null, true);
                    }
                    else
                    {
                                    console.log("not found");
                                    return callback(null, false);
                    }
       });
    };

server.register(require('hapi-auth-jwt2'), function (err) {

        if(err){
            console.log(err);
        }       

        server.auth.strategy('jwt', 'jwt',
        {   key: config.secret, // Never Share your secret key
            validateFunc: validate     // validate function defined above
        });      
        server.auth.default('jwt');

        server.route([
        {
            method: "GET", path: "/aboutus", config: { auth: 'jwt' },
            handler: function(request, reply) {
                reply('<h1>My first website</h1>');
            }
        }
        ]);
});
function mainHandler(err1) {
  if (err1) {
    throw err1;
  }
  // Start the server
  server.start((err1) => {
    console.log('Server running at:', server.info.uri);
  });
};

server.register(listOfRoutes, mainHandler);