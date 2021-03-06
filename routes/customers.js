const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { Customer, validateCustomer } = require('../models/customer');

// return all customer
router.get('/', async (req, res) => {

    const customer = await Customer.find().sort('name');

    res.send(customer);
});

// return customer by id
router.get('/:id', async (req, res) => {

    const customer = await Customer.findById(req.params.id);

    // if customer id does not exist return 404
    if(!customer) {
        return res.status(404).send('The customer with the given ID was not found.')
    }

    // else return the customer data
    res.send(customer); 

});

// this can be tested in postman.
router.post('/', auth, async (req, res) => {

    // object destructoring
    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(400 ).send(error.details[0].message);
    }

    res.send(req.body);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    try {

        const customerResponse = await customer.save();
        res.send(customerResponse);

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

    }

});

// example PUT request
router.put('/:id', auth, async (req, res) => {

    // object destructoring
    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(400 ).send(error.details[0].message);
    }

    let customer = null;

    try {

        // update a document and return it
        customer = await Customer.findByIdAndUpdate( req.params.id, { 
            name: req.body.name ,
            isGold: req.body.isGold ,
            phone: req.body.phone,
        }, { new: true });

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
        
        // if customer id does not exist return 404
        return res.status(404).send('The customer with the given ID was not found.');

    }

    res.send(customer);

});

// delete customer
router.delete('/:id', auth, async (req, res) => {

    let customer = null;

    try {

        customer = await Customer.findByIdAndRemove(req.params.id);

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

        // if customer id does not exist return 404
        return res.status(404).send('The customer with the given ID was not found.')

    }

    // return customer that has been deleted
    res.send(customer); 

});

module.exports = router;