require('./utils/db');
require('./utils/auth');

const passport = require('passport');
const express = require('express');
const cors = require('cors');
const path = require('path'); const cookieParser = require('cookie-parser');

const index = require('./routes/index');
const flights = require('./routes/flights');

const app = express();

// view engine setup
app.set('view engine', 'ejs');

// allow cors
app.use(cors());

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    domain: 'localhost:8080',
    saveUninitialized: true
};
app.use(session(sessionOptions));

// enable cookies
app.use(cookieParser());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// set user authentication
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use('/', index);
app.use('/flights', flights);

app.listen(3000);
