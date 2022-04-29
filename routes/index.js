const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res) => {
    res.render('index');
})

router.post('/api/register', (req, res) => {
    const { username, password, prefix, phone } = req.body;
    User.register(new User({ username, prefix, phone }), password, (err, user) => {
        if (err) {
            res.json({ error: 1, message: 'Your registration information is not valid' });
        } else {
            passport.authenticate('local')(req, res, function () {
                res.json({ success: 1 });
            });
        }
    });
});

router.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (user) {
            req.logIn(user, (err) => {
                res.cookie('username', req.user.username,);
                res.json({ success: 1, username: req.user.username });
            });
        } else {
            res.json({ error: 1, message: 'Your login or password is incorrect' });
        }
    })(req, res, next);
});

module.exports = router;
