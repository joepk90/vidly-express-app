module.exports = function(err, req, res, next) {

    // this function is run in the async middleware catch statement, after the routes initial logic

    // 500 = internal server error
    res.status(500).send('Something failed');
    
}