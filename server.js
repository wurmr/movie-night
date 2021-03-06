const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const movieNights = require('./routes/api/movieNights');
const movies = require('./routes/api/movies');
const users = require('./routes/api/users');
const hostingOrders = require('./routes/api/hostingOrders');


const app = express();

// Bodyparser Middlewear
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/movieNights', movieNights);
app.use('/api/movies', movies);
app.use('/api/users', users);
app.use('/api/hostingOrders', hostingOrders);

// Serve static assets in Producion
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));