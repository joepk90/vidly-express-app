const { User } = require('../../../models/user.js');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid json webtoken', () => {

        // create user object args (mongoose id required)
        //must be coverted to hexidecimal string to match what jwt within the generateAuthToken function
        const payload = { 
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true };


        // create new user and generate auth token
        const user = new User( payload );
        const token = user.generateAuthToken(); // will convert json web token to hexidecimal string

        // decode using jsonwebtoken dependancy
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        // confirm decoded object matches return generated auth token from the user.generateAuthToken method
        expect(decoded).toMatchObject(payload); 

        
    });
});