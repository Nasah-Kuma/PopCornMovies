const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const movies = require('./routes/movies');
const express = require('express');
const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost/vidly")
.then(() => console.log('connected to MongoDB...'))
.catch((err) => console.error("Could not connect to MOngoDB", err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);


app.listen(port, () => {
    console.log("Listening on port 3000")
})