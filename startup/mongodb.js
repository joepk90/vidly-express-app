
const winston = require('winston');
const mongoose = require('mongoose');
const { db } = require('../utilities/environmentVars');

module.exports = function () {

    mongoose.connect(db)
    .then( () => winston.info(`Connected to ${db}...`))
    // to connect to mongoDB, make sure mongodb is running on localhost. run:
    // mongod

}

