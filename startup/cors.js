
const config = require('config');

/**
 * NEEDS REFACTORING
 * setup to use config settings
 * make this work within a development environment using OS env variables
 */

module.exports = function(app) {

    if (config.has('enable_CORS') && config.get('enable_CORS' === true)) {
        const cors = require('cors')
        app.use(cors());
    }

}