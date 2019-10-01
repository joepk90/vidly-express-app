
const Joi = require('joi');  
const express = require('express');
const genres = require('./routes/genres');
const home = require('./routes/home');
const app = express();

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