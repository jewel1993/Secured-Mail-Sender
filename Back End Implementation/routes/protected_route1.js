var quoter  = require('./quoter');
exports.getRandomQuote = function(request, reply){
                console.log("protected quotes entry");
                reply(quoter.getRandomOne()).code(200).header("Authorization", request.headers.authorization);;
}