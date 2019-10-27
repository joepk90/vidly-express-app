require('express-async-errors'); // handles async errors (see custom middleware async.js module)

const winston = require('winston');
require('winston-mongodb');

// config
const config = require('config');

const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const auth = require('./routes/auth');
const users = require('./routes/users');
const rentals = require('./routes/rentals');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const home = require('./routes/home');
const error = require('./middleware/error');
const app = express();

winston.add(winston.transports.File, {filename: 'logfile.log'});

    // winston error levels:
    // error
    // warn
    // info
    // verbose
    // debug
    // silly

winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vidly',
    level: 'error' // only log errros to the mongodb DB
    // level: 'info' // if info is set, info, warn and error messages would be logged to the mongodb DB 
    // level: 'silly' // if silly is set, all errors would be logged to mongodb DB 
});

// note: errors thrown outside of express won't be saved to the logfile or db without the following code.
// the folowing code manually subscribes to any uncaughtException produced by node
process.on('uncaughtException', (ex) => {
    console.log('ERROR: applicaton produced uncaught exception');
    winston.error(ex.message, ex);
    process.exit(1); // exit application
} )

// uncomment the following line to test an error run outside of the context of express: 
// throw new Error('Error: this error is outside th e context of express and wont be saved to the logfile or db')

// note: errors unhandled rejectoins (syncrynouse code/Promises) thrown outside of express won't be saved to the logfile or db without the following code.
// the folowing code manually subscribes to any unhandledRejection produced by node
process.on('unhandledRejection', (ex) => {
    console.log('ERROR: applicaton produced an unhandled promise rejection');
    winston.error(ex.message, ex);
    // process.exit(1); // exit application
} )

// uncomment the following l2 lines to test an unhandledRejection run outside of the context of express: 
// const promiseError = Promise.reject(new Error('example promise error'));
// promiseError.then( () => console.log('done')); // no catch statement setup so error will be produced


 // testing purposes jwtPrivateKey = 1234 (mapped through custom environment variables)
 // run export vidly_jwtPrivateKey=1234
if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined');
    // process.exit(1); // exit application
}

mongoose.connect('mongodb://localhost/vidly')
.then( () => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB', err))
// to connect to mongoDB, make sure mongodb is running on localhost. run:
// mongod

app.use(express.json());

// routes
app.use('/', home);
app.use('/api/users', users);
app.use('/api/rentals', rentals);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/auth', auth);

// error handler - must be registered after the routes
app.use(error);

// $ export PORT=5000
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}...`))
// app.post();
// app.put();
// app.delete();





const functionForTests = async function () {

    const { Movie } = require('./models/movie');

    const movie = await Movie.findById("5d99dbaf805bab394e8d0d61");

    console.log(movie);

} 


// functionForTests();