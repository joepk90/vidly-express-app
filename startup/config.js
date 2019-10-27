// config
const config = require('config');

module.exports = function() {

    // testing purposes jwtPrivateKey = 1234 (mapped through custom environment variables)
    // run export vidly_jwtPrivateKey=1234
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.'); 
    }

}