const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const dotenv = require('dotenv');

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

let ppUrl = undefined;

router.get('/getdata',  (req, res) => {
    const covers = require('../data/data.json');
    res.json(covers);
});

router.get('/',  async (req, res) => {

    if(req.session.user === undefined) {
        res.redirect('/login');
        return;
    }

    if(req.session.user.ppUrl !== "../images/af_avatar.jpg") {
        dotenv.config();

        const region = process.env.AWS_BUCKET_REGION;
        const bucketName =process.env.AWS_BUCKET_NAME;
        const accessKeyId = process.env.AWS_ACCESS_KEY;
        const secretAccessKey = process.env.AWS_SECRET_KEY;
    
        const s3 = new S3Client({
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            },
            region: region
        })

        const imageName = "pp-" + req.session.user.username;
    
        const getObjectParams = {
            Bucket: bucketName,
            Key: imageName
        }
    
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        ppUrl = url;
    }

    res.render('home', {
        title: 'Alan Ford Online',
        user: req.session.user
    });
});




module.exports = router;