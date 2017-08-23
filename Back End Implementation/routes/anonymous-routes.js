var quoter  = require('./quoter');


exports.register = function(server, options, next) {
  server.route({
      method: 'GET',
      path: '/api/random-quote',
      config: { auth: false },
      handler: function(request, reply) {
          reply(quoter.getRandomOne()).code(200);
      }
  });
  
  return next();
};
exports.register.attributes = {  
  name: 'anonymous-apis'
};