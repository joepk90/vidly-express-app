/**
 * Configure Dotenv package
 * @param
 * @returns 
 */
const configureDotenv = () => {

    // including the dotenv package causes node server errors (vercel)
    // when dotenv is required, the node server looks for an .env file (production.env file)
    // if this doesn't exist it will cause the server to produce a failing error...
    // dotenv can only be included in development 
    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config();
    }
}

configureDotenv();

/**
 * 
 * @param environmentVariable 
 * @returns 
 */
const getEnvironmentVariable = (environmentVariable) => {

    const unvalidatedEnvironmentVariable = process.env[environmentVariable];

    if (!unvalidatedEnvironmentVariable) {
        throw new Error(
            `Couldn't find environment variable: ${environmentVariable}`
        );
    } else {
        return unvalidatedEnvironmentVariable;
    }
};

const db = getEnvironmentVariable('vidly_db');
const jwtPrivateKey = getEnvironmentVariable('vidly_jwtPrivateKey');
const enableCORS = getEnvironmentVariable('enable_CORS');

module.exports = { getEnvironmentVariable, db, jwtPrivateKey, enableCORS };