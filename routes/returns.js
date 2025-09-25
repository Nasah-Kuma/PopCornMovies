const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rentals");
const { Movie } = require("../models/movies");
const auth = require("../middleware/auth");
const moment = require("moment");
const Joi = require("joi");

router.post("/", auth, async (req, res) => {
  const { error } = validateReturn(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("Renturn already processed.");

  rental.dateReturned = new Date();

  const rentalDays = moment().diff(rental.dateOut, 'days')
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

  await rental.save();

  await Movie.updateOne({_id: rental.movie._id}, {
    $inc: { numberInStock: 1 }
  });

  return res.status(200).send(rental);
});

function validateReturn(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
}


module.exports = router;
