const ejs = require('ejs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');

const transporter = nodemailer.createTransport(`smtps://${process.env.MAIL_LOGIN}:${process.env.MAIL_PASS}@smtp.yandex.ru`);

const sampleEp = {
    "_id":"58300c88d8142d2a78a76c4f",
    "source":"lostfilm",
    "serial_rus_name":"Слепое пятно",
    "episode_name":"Остановить вторую фазу (Why Let Cooler Pasture Deform)",
    "season":2,
    "icon":"http://www.lostfilm.tv/Static/icons/cat_blindspot.jpeg",
    "release_date":"2016-11-18T20:25:00.000Z",
    "episode_url":"http://www.lostfilm.tv/details.php?id=20295",
    "serial_name":"Blindspot",
    "serial_orig_name":"Blindspot",
    "download_page_url":"http://retre.org/?c=258&s=2.00&e=09&u=5129322&h=b91b874f62bb713c2f7d364f6b3230fb",
    "__v":0,
    "download_urls":[
        {
            "link":"http://tracktor.in/td.php?s=bM1npFdaxPrOGFWwTl%2FEogM25jXGeS0VHzZ0NPn1uIpEk8ykHt2Ker6hBB7opoEHQbAHKxpAQ0ylMCTvfdnCtMbDK06H7NfVN5so47BR5nYmU8siXoobg5bipiRS%2B3HUSy62dQ%3D%3D",
            "quality":"WEB-DLRip",
            "size":"508.60 МБ",
            "_id":"58300c88d8142d2a78a76c52"
        },
        {
            "link":"http://tracktor.in/td.php?s=3nVUAntPI5N3nYKdy4z3ZNfPQvKFIXr4npATGEYpu9H0dYj4EJJlG6uM%2B0mEUNw6gI0x4nTxkBIFHLH%2B1N0jPik%2FmmabkPCbbE5Y12valjbWhUF9y1a4uZwMEnQgNx1FMboxpA%3D%3D",
            "quality":"1080p WEB-DLRip",
            "size":"1.81 ГБ",
            "_id":"58300c88d8142d2a78a76c51"
        },
        {
            "link":"http://tracktor.in/td.php?s=QeEI0JwhBJ%2FhMgm%2BlyRKDyBWrLSexAMN8mzvd0QrJw1%2B2PBAASLVSgY%2FCZ67UZWeVB2eKijIIyCvkRf1gT1I1xE0dA0H4CAuc%2BRU0Qy7PpS%2BnwPLNKasduxka%2BZGQ%2Bi8KlIixQ%3D%3D",
            "quality":"720p WEB-DL",
            "size":"1.30 ГБ",
            "_id":"58300c88d8142d2a78a76c50"
        }
    ],
    "full_season":false,
    "episode_number":9
};

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
                readTemplate('./templates/episode.ejs')
                    .then(template => {
                        subs.forEach(sub => {
                            User
                                .findById(sub.user_id)
                                .exec((err, user) => {
                                    if (!err && user){
                                        let mailOptions = {
                                            from: '"Serialoman" <serialoman.kpi@yandex.ru>',
                                            to: user.email,
                                            subject: `Serialoman: вышла новая серия ${episode.serial_orig_name} S${episode.season}E${episode.episode_number}`, // Subject line
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

exports.notifyAboutNewEpisode(sampleEp);

