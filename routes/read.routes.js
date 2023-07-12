const express = require('express');
const db = require('../db');
const router = express.Router();
const Comic = require('../models/ComicModel');
const User = require('../models/UserModel');

let user = undefined;
let comic = undefined;
let cover = undefined;

router.get('/:id', async (req, res) => {

    if(req.session.user === undefined) {
        res.redirect('/login');
        return;
    }

    comic =  await Comic.fetchById(req.params.id);
    cover = '../images/af_coveri/af_cover_' + req.params.id + '.jpg';

    let lastPage = null;

    const sql = 'SELECT page FROM comics_progress WHERE id_comic = ' + req.params.id + ' AND id_user = ' + req.session.user.id;
    let result = await db.query(sql, []) ;
    result.rows.length == 0 || result.rows[0].page == comic.pages.length ? lastPage = 1 : lastPage = result.rows[0].page; 

    res.render('read', {
        title: 'Alan Ford Online',
        user: req.session.user,
        cover: cover,
        comic: comic,
        lastPage: lastPage
    })

})

router.post('/:id', async (req, res) => {

    user == undefined ? user = await User.fetchByUsername(req.session.user.username) : {};
    await user.addProgressToDB(user.id, req.params.id, req.body.page); 

    return res.status(204);
   
})


module.exports = router;