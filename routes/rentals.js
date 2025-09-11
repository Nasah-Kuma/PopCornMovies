const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customers");

const mongoose = require("mongoose");

//const db = mongoose.connection;

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // const session = await db.startSession();

  // const transactionOptions = {
  //   readPreference: "primary",
  //   readConcern: { level: "local" },
  //   writeConcern: { w: "majority" },
  // };

  try {
    // Convert mongo Db to a replica set to use transactions
    // https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/
    // const transactionsResults = await session.withTransaction(async () => {
    //   await rental.save({ session });
    //   movie.numberInStock--;
    //   await movie.save({ session });
    // },
    // transactionOptions);

    // if(transactionsResults) {
    //   console.log("Transaction successfully committed.");
    //   res.send(rental);
    // } else {
    //   console.log("Transaction aborted.");
    // }

    await rental.save({ session });
    movie.numberInStock--;
    await movie.save({ session });
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed.");
  } finally {
    await session.endSession();
  }
});

module.exports = router;
