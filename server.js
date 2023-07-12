const express = require('express');
const path = require('path');
const pg = require('pg');
const db = require('./db');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
var bodyParser = require('body-parser');

const app = express();

const redirectRouter = require('./routes/redirect.routes');
const homeRouter = require('./routes/home.routes');
const loginRouter = require('./routes/login.routes');
const readRouter = require('./routes/read.routes');
const historyRouter = require('./routes/history.routes');
const profileRouter = require('./routes/profile.routes');
const analyticsRouter = require('./routes/analytics.routes');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));

app.use(session(
{
    store: new pgSession({
        pool: db.pool
    }),
    secret: "tajna",
    resave: false,
    saveUnitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000}
}
))

app.use('/', redirectRouter);
app.use('/home', homeRouter);
app.use('/login', loginRouter);
app.use('/read', readRouter);
app.use('/history', historyRouter);
app.use('/profile', profileRouter);
app.use('/analytics', analyticsRouter)

app.listen(5500, () => console.log('Server running on port 5000'));


