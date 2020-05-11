const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { User, validateUser } = require('../models/user');

// return all user - TODO setup with new auth function. only return data if  user is admin
router.get('/', async (req, res) => {

    const user = await User.find().sort('name');

    res.send(user);
});


// return user by id - TODO setup with new auth function. only return data if  user is admin
// router.get('/:id', async (req, res) => {

//     const user = await User.findById(req.param.id);

//     // if user id does not exist return 404
//     if(!user) {
//         return res.status(404).send('The user with the given ID was not found.')
//     }

//     // else return the user data
//     res.send(user); 

// });


// return current user using jsonwebtoken
router.get('/me', auth, async (req, res) => {

    // extra check
    // if (!req.user._id) return res.header(401).send('Something wrong - unable to determine user');  

    // get user ID from json web token
    const user = await User.findById(req.user._id).select('-password'); // exclude password

    // if user id does not exist return 404
    if(!user) {
        return res.status(404).send('The user with the given ID was not found.')
    }

    // else return the user data
    res.send(user); 

});


// this can be tested in postman.
router.post('/', async (req, res) => {

    // object destructoring
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400 ).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
        return res.status(400).send('User already registered.');
    }

    user = new User((_.pick(req.body, ['name', 'email', 'password'])));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // or use
    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // }); 

    try {

        await user.save();

        const token = user.generateAuthToken();

        res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send(_.pick(user, ['_id', 'name', 'email']));

        // or use the following
        // res.send({
        //     name: req.body.name,
        //     email: req.body.email,
        // });

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

    }

});

// example PUT request - TODO setup with new auth function. only return data if user is admin is current user
router.put('/:id', async (req, res) => {

    // object destructoring
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400 ).send(error.details[0].message);
    }

    let user = null;

    try {

        // update a document and return it
        user = await User.findByIdAndUpdate( req.params.id, { 
            name: req.body.name ,
            email: req.body.email,
            password: req.body.password,
        }, { new: true });

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
        
        // if user id does not exist return 404
        return res.status(404).send('The user with the given ID was not found.');

    }

    res.send(user);

});

// delete user - TODO setup with new auth function. only return data if user is admin is current user
router.delete('/:id', async (req, res) => {

    let user = null;

    try {

        user = await User.findByIdAndRemove(req.params.id);

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

        // if user id does not exist return 404
        return res.status(404).send('The user with the given ID was not found.')

    }

    // return user that has been deleted
    res.send(user); 

});

module.exports = router;