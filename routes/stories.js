// VARIABLES
const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { ensureAuth } = require('../middleware/auth');

// @DESC:   ADD STORIES PAGE
// @ROUTE:  GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

// @DESC:   SHOW ALL STORIES PUBLIC   
// @ROUTE:  GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createAt: 'desc' })
            .lean()
        res.render('stories/index', {
            stories,
        });
    } catch (err) {
        console.error(err);
        res.render('error/500'); 
    }
});

// @DESC:   SHOW SINGLE STORY PAGE   
// @ROUTE:  GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).lean();
        console.log(story);
        res.render('stories/show', {
            story,
        });
    } catch (err) {
        console.error(err);
        res.render('error/404'); 
    }
});

// @DESC:   PROCESS ADD STORY  
// @ROUTE:  POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('error/500'); 
    }
});

// @DESC:   SHOW EDIT PAGE   
// @ROUTE:  POST /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const story = await Story.findOne({ _id: req.params.id }).lean();
    //CHECK STORY
    if (!story) {
        res.render('error/404');
    }
    //CHECK USER
    if (story.user != req.user.id) {
        res.redirect('/stories');
    } else {
        res.render('stories/edit', {
            story,
        });
    }
});


// @DESC:   PROCESS UPDATE STORY
// @ROUTE:  PUT /stories/:id 
router.put('/:id', ensureAuth, async (req, res) => {
    let story = await Story.findById(req.params.id).lean();
    //CHECK STORY
    if (!story) {
        res.render('error/404');
    }
    //CHECK USER
    if (story.user != req.user.id) {
        res.redirect('/stories');
    } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, 
            {
                new: true,
                runValidators: true,
            }    
        );
        res.redirect('/dashboard');
    }
});

// @DESC:   PROCESS DELETE STORY
// @ROUTE:  DELETE /stories/:id 
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.findByIdAndRemove(req.params.id);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
    };
});


// @DESC:   SHOW ALL STORIES OF THE USER
// @ROUTE:  GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public',
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories,
        });
    } catch (err) {
        console.error(err);
        res.render('error/404'); 
    }
});

module.exports = router;