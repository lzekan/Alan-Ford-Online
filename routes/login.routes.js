const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

router.get('/', (req, res) => {

    console.log(req.session.user)

    req.session.user = undefined;
    
    res.render('login', {
        title: 'Alan Ford Online',
        errLogin: undefined,
        errReg: undefined,
        type: 'login'
    })
})

router.post('/', async (req, res) => {

    if(req.body.regUsername === undefined) 
    {
        (async() => {

            let user = await User.fetchByUsername(req.body.username.trim());
    
            if(req.body.username === '' && req.body.password === ''){
                res.render('login', {
                    title: 'Alan Ford Online',
                    errLogin: 'Ispunite potrebne podatke.',
                    errReg: undefined,
                    type: 'login'
                });
        
                return;
            }

            let check = await user.checkPassword(req.body.password.trim());
        
            if (user.id === undefined || !check) {
                res.render('login', {
                    title: 'Alan Ford Online',
                    errLogin: 'Netočno korisničko ime ili lozinka.',
                    errReg: undefined,
                    type: 'login'
                });
                return;
            }

            req.session.user = user;
            res.redirect('/home');
        })();
    
    }

    else if(req.body.regUsername !== undefined)
    {
        (async () => {
            let user = await User.fetchByUsername(req.body.regUsername.trim());

            if(req.body.regPassword1 !== req.body.regPassword2){
                res.render('login', {
                    title: 'Alan Ford Online',
                    errLogin: undefined,
                    errReg: 'Lozinke se ne podudaraju.',
                    type: 'register' 
                });
                return;
            }

            if(user.id !== undefined) {
                res.render('login', {
                    title: 'Alan Ford Online',
                    errLogin: undefined,
                    errReg: 'Korisničko ime već u uporabi.',
                    type: 'register' 
                });
                return;
            }

            user = new User(req.body.regUsername.trim(), req.body.regPassword1.trim(), req.body.regEmail.trim(), req.body.regFirstName.trim(), req.body.regLastName.trim());
            await user.persist();

            console.log(user)

            req.session.user = user;
            res.redirect('/home');
        })();
    }
}

)

module.exports = router;