const winston = require('winston');
const express = require('express');
const app = express();

const logging = require('./startup/logging'); 
const routes = require('./startup/routes'); 
const mongodb = require('./startup/mongodb'); 
const config = require('./startup/config'); 
const validation = require('./startup/validation'); 

logging();
routes(app);
mongodb();
config();
validation();

// $ export PORT=5000
const port = process.env.PORT || 3000

app.listen(port, () => winston.info(`listening on port ${port}...`))
// app.post();
// app.put();
// app.delete(); 