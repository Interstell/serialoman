const User = require('../models/user.model');
const crypto = require('crypto');
const passport = require('passport');

exports.HashMD5 = function(password, salt){
    return crypto.createHash('md5').update(password + salt).digest("hex");
};

exports.registerNewUser = function (req,res) {
    User
        .findOne({$or:[{email: req.body.email}, {username: req.body.username}]})
        .exec((err, data) => {
            if (err){
                res.status(500).json({error: 'Internal server error'})
            }
            else if (data){
                res.status(500).json({error: 'Пользователь с таким ником / email уже существует.'})
            }
            else {
                if (req.body.password1 != req.body.password2)
                    return res.status(500).json({error: 'Пароли не совпадают.'});
                req.body.password = exports.HashMD5(req.body.password1, process.env.PASSWORD_SALT);
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