const express = require('express');
const passport = require('passport');
const router = express.Router();

// @DESC:   AUTH WITH GOOGLE
// @ROUTE:  GET /auth/google
router.get('/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] }),
);

// @DESC:   AUTH GOOGLE CALLBACK
// @ROUTE:  GET auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/' ,
    }),
);

// @DESC: LOGOUT USER
// @ROUTE: GET auth/logout
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err => { next(err) });
        res.redirect('/');
    });
});

module.exports = router;