const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res) => {
    res.render('index');
})

router.post('/register', (req, res) => {
    const { username, password, prefix, phone } = req.body;
    User.register(new User({ username }), password, (err, user) => {
        if (err) {
            res.render('register', { error: 1, message: 'Your registration information is not valid' });
        } else {
            passport.authenticate('local')(req, res, function () {
                res.json({ code: 200 });
            });
        }
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (user) {
            req.logIn(user, (err) => {
                res.json({ code: 200, username: req.body.username });
            });
        } else {
            res.json({ error: 1, message: 'Your login or password is incorrect' });
        }
    })(req, res, next);
});

module.exports = router;
