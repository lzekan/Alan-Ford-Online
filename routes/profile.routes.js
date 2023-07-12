const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcrypt');
const aws = require('aws-sdk');
const dotenv = require('dotenv');
const User = require('../models/UserModel')

router.get('/', async (req, res) => {

    if(req.session.user === undefined) {
        res.redirect('/login');
        return;
    }

    let sql = 'SELECT profilepicture FROM users WHERE id = ' + req.session.user.id;
    let result = await db.query(sql, []);

    req.session.user.ppUrl = result.rows[0].profilepicture;

    res.render('profile', {
        user: req.session.user,
        err: undefined,
        msg: undefined
    });
})

router.get('/s3Url', async (req, res) => {
    
    const url = await generateUploadURL(req.session.user);

    let sql = "UPDATE users SET profilepicture = '" + url.split('?')[0] + "' WHERE id = " + req.session.user.id;
    await db.query(sql, []);
    
    res.send({url});

})

router.post('/', async (req, res) => {
    
    if(req.body.password1 !== req.body.password2){
        res.render('profile', {
            user: req.session.user,
            err: 'Lozinke se ne podudaraju.',
            msg: undefined
        });
        return;
    }

    let userPot = await User.fetchByUsername(req.body.username.trim());

    if (userPot.id !== undefined && userPot.id !== req.session.user.id) {
        res.render('profile', {
            user: req.session.user,
            err: 'Korisničko ime zauzeto.',
            msg: undefined
        });
        return;
    }

    userPot = await User.fetchByEmail(req.body.email.trim());

    if (userPot.id !== undefined && userPot.id !== req.session.user.id) {
        res.render('profile', {
            user: req.session.user,
            err: 'Adresa e-pošte već zauzeta.',
            msg: undefined
        });
        return;
    }

    let hashedPassword = await bcrypt.hash(req.body.password1, 10);

    let sql = "UPDATE users SET username = '" + req.body.username + "', password = '" + hashedPassword + "', email = '" + req.body.email +
        "', firstname = '" + req.body.firstname + "', lastname = '" + req.body.lastname + "' WHERE id = " + req.session.user.id;   
    
    await db.query(sql, []);

    req.session.user.username = req.body.username;
    req.session.user.password = hashedPassword;
    req.session.user.email = req.body.email;
    req.session.user.firstName = req.body.firstname;
    req.session.user.lastName = req.body.lastname;

    res.render('profile', {
        user: req.session.user,
        err: undefined,
        msg: 'Promjene uspješno spremljene.',
    });

})

async function generateUploadURL(user) {

    dotenv.config();

    const region = process.env.AWS_BUCKET_REGION;
    const bucketName = process.env.AWS_BUCKET_NAME
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_KEY;

    const s3 = new aws.S3({
        region,
        accessKeyId,
        secretAccessKey,
        signatureVersion: 'v4'
    })
    const imageName = "pp-" + user.username;

    const params = ({
        Bucket: bucketName,
        Key: imageName
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}



module.exports = router;