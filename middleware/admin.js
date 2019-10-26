module.exports = function(req, res, next) {

    // 401 Unauthorized (no token supplied, or invalid token)
    // 403 Forbidden  (valid token supplied, but your token doesn't have permission)

    if (req.user.isAdmin === false) {
        return res.status(403).send('Access denied. Incorrect permissions.')
    }

    next();

}