const mongoose = require('mongoose');

module.exports = function(req, res, next) {

    if (mongoose.Types.ObjectId.isValid(req.params.id) === false) {
        return res.status(404).send('Invalid ID.')
    };


    // move onto next middleware function
    next();

}