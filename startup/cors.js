
// const { enableCORS } = require('../utilities/environmentVars');

/**
 * NEEDS REFACTORING
 * setup to use config settings
 * make this work within a development environment using OS env variables
 */

module.exports = function(app) {

    // if (enableCORS === true) {
    const cors = require('cors')
    app.use(cors());
    // }

}