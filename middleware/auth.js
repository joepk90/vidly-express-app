const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {

    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).send('Access denied. No token provided');;
    }

    try {

        // get user data created by the generateAuthToken
        const user = jwt.verify(token, config.get('jwtPrivateKey'));

         // assign user data to the request object
        req.user = user;

        // pass control to the next middleware funtion
        next();

    } catch(ex) {

        res.status(400).send('Access denied. Invalid token');

    }
};

module.exports = auth;