const User = require('../models/user.model');
const crypto = require('crypto');
const ENV_VARIABLES = require('../env_variables');
const passport = require('passport');

exports.HashMD5 = function(password, salt){
    return crypto.createHash('md5').update(password + salt).digest("hex");
};

exports.registerNewUser = function (req,res) {
    User
        .findOne({email: req.body.email})
        .exec((err, data) => {
            if (err){
                res.status(500).json({error: 'Internal server error'})
            }
            else if (data){
                res.json({error: 'User with this login/email already exists'})
            }
            else {
                if (req.body.password1 != req.body.password2)
                    return res.json({error: 'Passwords do not match.'});
                req.body.password = exports.HashMD5(req.body.password1, ENV_VARIABLES.password_salt);
                let user = new User(req.body);
                user.save((err, data) => {
                    if (err){
                        res.status(500).json({error: 'Internal server error'})
                    }
                    else{
                        data.password = undefined;
                        res.json(data);
                    }
                });
            }
        });
};