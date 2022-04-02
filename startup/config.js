const { jwtPrivateKey } = require('./../utilities/environmentVars');

module.exports = function() {

    // testing purposes jwtPrivateKey = 1234 (mapped through custom environment variables)
    // run export vidly_jwtPrivateKey=1234
    if (!jwtPrivateKey) {
        throw new Error('FATAL ERROR: vidly_jwtPrivateKey is not defined.');
    }

}