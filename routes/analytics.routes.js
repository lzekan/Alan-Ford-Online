const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
    
    if(req.session.user === undefined) {
        res.redirect('/login');
        return;
    }

    res.render('analytics', {
        user: req.session.user
    })
})

module.exports = router;