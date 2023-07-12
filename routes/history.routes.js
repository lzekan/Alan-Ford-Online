const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    
    if(req.session.user === undefined) {
        res.redirect('/login');
        return;
    }
    
    let sql =  'SELECT id_comic comicNo, page FROM comics_progress WHERE id_user = ' + req.session.user.id + ` ORDER BY comicNo`;
    const comics = await db.query(sql, []);

    let covers = require('../data/data.json');
    let coversNeeded = [];
    
    for(let comic of comics.rows) {
        for(let coverX of covers){
            if(comic.comicno == parseInt(coverX.title.split(' ')[0])) {
                coversNeeded.push(coverX);
            }
        }
    }

    res.render('history', {
        progress: comics.rows,
        user: req.session.user,
        data: coversNeeded
    })
})


module.exports = router;