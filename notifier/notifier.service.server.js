const ejs = require('ejs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');

const transporter = nodemailer.createTransport(`smtps://${process.env.MAIL_LOGIN}:${process.env.MAIL_PASS}@smtp.yandex.ru`);

function readTemplate(path){
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err)
                reject(err);
            else resolve(String(data));
        });
    });
}

exports.notifyAboutNewEpisode = function (episode) {
    Subscription
        .find({serial_orig_name: episode.serial_name})
        .exec((err, subs) => {
            if (subs && subs.length > 0){
                readTemplate('./notifier/templates/episode.ejs')
                    .then(template => {
                        subs.forEach(sub => {
                            User
                                .findById(sub.user_id)
                                .exec((err, user) => {
                                    if (!err && user){
                                        let mailOptions = {
                                            from: '"WatchMan" <serialoman.kpi@yandex.ru>',
                                            to: user.email,
                                            subject: `WatchMan: вышла новая серия! ${episode.serial_orig_name} S${episode.season}E${episode.episode_number}`, // Subject line
                                            html: ejs.render(template, {user: user, episode: episode})
                                        };
                                        transporter.sendMail(mailOptions, (err, info) => {
                                            if(err)
                                                console.error(err);
                                        });
                                    }
                                });
                        });
                    });
            }
        })
};

