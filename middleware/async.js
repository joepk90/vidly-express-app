module.exports = function (handler) {

    // function passes in an IIFE expressed in the route
    // this function manages the try catch block for all route functionality

    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch(exc) {
            next();
        }
    }
}