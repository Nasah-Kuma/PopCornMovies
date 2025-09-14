const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error');
const config = require('config');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const movies = require('./routes/movies');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();
const port = 3000;

//handling uncaught exceptions: things that go wrong outside express
process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});

//handling unhandled promise rejections: things that go wrong outside express
process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});


winston.handleExceptions(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
    new winston.transports.Console({ colorize: true, prettyPrint: true })
);

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'info' }));

if(!config.get('jwtPrivateKey')){
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

mongoose.connect("mongodb://localhost/vidly")
.then(() => console.log('connected to MongoDB...'))
.catch((err) => console.error("Could not connect to MOngoDB", err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

app.listen(port, () => {
    console.log("Listening on port 3000")
})