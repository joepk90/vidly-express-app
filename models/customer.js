const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchemaProperties = {
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
}

const customerSchema = new mongoose.Schema(customerSchemaProperties);

const Customer = mongoose.model( 'Customer', customerSchema );


function validateCustomer(customer) {

    // validation using joi dependancy
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(6).max(50).required()
    }

    return Joi.validate(customer, schema);

}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
exports.customerSchemaProperties = customerSchemaProperties;
exports.customerSchema = customerSchema;