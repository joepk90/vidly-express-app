const winston = require('winston');

module.exports = function(err, req, res, next) {

    // winston.log('error: ' + err.message); // alternative way of loggin errors

    // using winston methods
    winston.error(err.message, err);

    // error
    // warn
    // info
    // verbose
    // debug
    // silly

    // this function is run in the async middleware catch statement, after the routes initial logic

    // 500 = internal server error
    res.status(500).send('Something failed');
    
}