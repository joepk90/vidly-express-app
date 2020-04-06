const winston = require('winston');
// require('winston-mongodb');

require('express-async-errors'); // handles async errors (see custom middleware async.js module)

const config = require('config');

module.exports = function() {

    winston.add(winston.transports.File, {filename: 'logfile.log'});

    // winston error levels:
    // error
    // warn
    // info
    // verbose
    // debug
    // silly

    // winston.add(winston.transports.MongoDB, {
    //     db: config.get('db'),
    //     level: 'error' // only log errros to the mongodb DB
    //     // level: 'info' // if info is set, info, warn and error messages would be logged to the mongodb DB 
    //     // level: 'silly' // if silly is set, all errors would be logged to mongodb DB 
    // });

    // note: errors thrown outside of express won't be saved to the logfile or db without the following code.
    // the folowing code used winston to catch any uncaughtException produced by node
    winston.handleExceptions(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({filename: 'uncaughtExceptions.log'})
    );

    // uncomment the following line to test an error run outside of the context of express: 
    // throw new Error('this error is outside the context of express and wont be saved to the logfile or db')


    // note: errors unhandled rejectoins (syncrynouse code/Promises) thrown outside of express won't be saved to the logfile or db without the following code.
    // the folowing code manually subscribes to any unhandledRejection produced by node
    process.on('unhandledRejection', (ex) => {
        console.log('ERROR: applicaton produced an unhandled promise rejection');

        // following code uses winstons handleExceptions method to log error
        throw ex;
    } )

    // uncomment the following l2 lines to test an unhandledRejection run outside of the context of express: 
    // const promiseError = Promise.reject(new Error('example promise error'));
    // promiseError.then( () => console.log('done')); // no catch statement setup so error will be produced

}