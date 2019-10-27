require('express-async-errors'); // handles async errors (see custom middleware async.js module)

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

 // testing purposes jwtPrivateKey = 1234 (mapped through custom environment variables)
 // run export vidly_jwtPrivateKey=1234
if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
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