const winston = require('winston');
const express = require('express');
const app = express();

if (process.env.ENABLE_CORS === true) {
    const cors = require('cors')
    app.use(cors());
}


const logging = require('./startup/logging'); 
const routes = require('./startup/routes'); 
const mongodb = require('./startup/mongodb'); 
const config = require('./startup/config'); 
const validation = require('./startup/validation'); 
const prod = require('./startup/prod'); 

logging();
routes(app);
mongodb();
config();
validation();
prod(app);

// $ export PORT=5000
const port = process.env.PORT || 3000

const server = app.listen(port, () => winston.info(`listening on port ${port}...`));
// app.post();
// app.put();
// app.delete(); 

module.exports = server;