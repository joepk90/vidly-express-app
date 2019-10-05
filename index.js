const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const home = require('./routes/home');
const app = express();

mongoose.connect('mongodb://localhost/vidly')
.then( () => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB', err))
// to connect to mongoDB, make sure mongodb is running on localhost. run:
// mongod

app.use(express.json());

// routes
app.use('/', home);
app.use('/api/genres', genres);

// $ export PORT=5000
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}...`))
// app.post();
// app.put();
// app.delete();