const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {

    const token = req.header('z-auth-header');

    if (!token) {
        return res.status(401).send('Access denied. No token provided');;
    }

    try {

        const isTokenValid = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = doceded;

        // pass control to the next middleware funtion
        next();

    } catch(ex) {

        res.status(400).send('Access denied. Invalid token');

    }
};

module.exports = auth;