
// TODO use validate function to validate other route handlers (see returns route handler)
module.exports = (validator) => {

    return(req, res, next) => {
        // object destructoring
        const { error } = validator(req.body);
        if (error) return res.status(400 ).send(error.details[0].message);
        next();
    }

};