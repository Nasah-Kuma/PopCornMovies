const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minlength: 5, maxlength: 50 },
      isGold: { type: Boolean, default: false },
      phone: { type: String, required: true, minlength: 5, maxlength: 50 },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
    }),
    required: true,
  },
  dateOut: { type: Date, required: true, default: Date.now },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 },
  date: { type: Date, default: Date.now },
});

const Rental = mongoose.model("rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
        customerId: Joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation").required(),
    movieId: Joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation").required(),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
