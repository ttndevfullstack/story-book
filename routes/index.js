// VARIABLES
const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const User = require('../models/User');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @DESC:   LOGGING PAGE
// @ROUTE:  GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', { 
        layout: 'login' 
    });
});

// @DESC:   DASHBOARD
// @ROUTE:  GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean(); 
        res.render('dashboard', {
            name: req.user.id,
            stories,
        });
    } catch (err) {
        console.log(err);
        res.redirect('error/500');
    }
});

module.exports = router;