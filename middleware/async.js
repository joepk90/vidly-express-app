/**
 * Async Middleware Try Catch Function:
 * function to manage try catch block for all route functionality
 * this function has been replaced with express-async-errors npm dependancy
 */


module.exports = function (handler) {

    // function passes in an IIFE expressed in the route

    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch(exc) {
            next();
        }
    }
}

/**
 * Example Route using Async Middleware Try Catch Function
 */

const asyncMiddleware = require('../middleware/async');

 // return all genres
router.get('/', asyncMiddleware( async(req, res, next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);

}));