const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

const app = express();

if (app.get('env') === 'development') {
    require('dotenv').config({silent:true});
}

const mongoose = require('mongoose');
if (!mongoose.connection.readyState){
    mongoose.connect(process.env.MONGODB_URI);
}

const api = require('./routes/api');
const User = require('./models/user.model');
const userCtrl = require('./controllers/user.controller.server');

const AppCron = require('./cron/jobs');
//AppCron.startJobs();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public-mdl', 'favicon.ico')));
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.COOKIE_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true
}));
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    User
        .findById(id)
        .exec((err, user) => {
            if (!user)
                done({userNotFound: true})
            done(null, user);
        });
});
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public-mdl')));

app.use('/api', api);

app.all("/*", (req, res, next) => {
    res.sendFile("index.html", { root: __dirname + "/public-mdl" });
});

passport.use(new LocalStrategy({
        usernameField:'email'
    },
    function(email, password, done) {
        console.log("[Auth] email: %s", email);
        User
            .findOne({
                email: email,
                password: userCtrl.HashMD5(password, process.env.PASSWORD_SALT)
            })
            .exec((err, user) => {
                if (!user)
                    return done(null, false);
                return done(null, user);
            });
    }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
