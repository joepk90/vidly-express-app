const winston = require('winston');

// note: this funciton is only run in the context of express.
// if any errors occur outside of express, this logic will not cathch them...
// see winston.handleExceptions function for error handling outside of express
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