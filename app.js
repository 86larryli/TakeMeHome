require('./utils/db');
require('./utils/auth');

const passport = require('passport');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const index = require('./routes/index');
const flights = require('./routes/flights');
const watchlist = require('./routes/watchlist');

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'dist')));

// allow cors
app.use(cors());

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

// enable cookies
app.use(cookieParser());

// set bodyparser
app.use(express.json());

// passport setup
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    if (req.user) {
        res.cookie('username', req.user.username);
    } else {
        res.clearCookie('username');
    }
    next();
});

app.use('/', index);
app.use('/flights', flights);
app.use('/watchlist', watchlist);

app.listen(80);
