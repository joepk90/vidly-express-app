const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();

const Customer = mongoose.model( 'Customer', new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: { 
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50
    },
}) );

// return all customer
router.get('/', async (req, res) => {

    const customer = await Customer.find().sort('name');

    res.send(customer);
});

// return customer by id
router.get('/:id', async (req, res) => {

    const customer = await Customer.findById(req.param.id);

    // if customer id does not exist return 404
    if(!customer) {
        return res.status(404).send('The customer with the given ID was not found.')
    }

    // else return the customer data
    res.send(customer); 

});

// this can be tested in postman.
router.post('/', async (req, res) => {

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

    let customerResult = null;

    try {

        customerResult = await customer.save();

    } catch(ex) {

        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }

    }
    
    res.send(customerResult);

});

// example PUT request
router.put('/:id', async (req, res) => {

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
router.delete('/:id', async (req, res) => {

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

function validateCustomer(customer) {

    // validation using joi dependancy
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(6).max(50).required()
    }

    return Joi.validate(customer, schema);

}

module.exports = router;