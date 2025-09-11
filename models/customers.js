const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  isGold: {
    type: Boolean, 
    default: false,
  },
  date: { type: Date, default: Date.now },
});
const Customer = mongoose.model("customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(5).required(),
    phone: Joi.string().min(5).max(5).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;