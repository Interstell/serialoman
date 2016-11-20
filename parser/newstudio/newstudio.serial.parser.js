const request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    ENV_VARIABLES = require('../env_variables.js'),
    moment = require('moment');


let sampleSerials = [{ rus_name: 'Атланта',
    url: 'http://newstudio.tv//viewforum.php?f=491',
    source: 'newstudio',
    orig_name: 'Atlanta' },
    { rus_name: 'Балерины',
        url: 'http://newstudio.tv//viewforum.php?f=263',
        source: 'newstudio',
        orig_name: 'Bunheads' },
    { rus_name: 'Банши',
        url: 'http://newstudio.tv//viewforum.php?f=287',
        source: 'newstudio',
        orig_name: 'Banshee' },
    { rus_name: 'Батл Крик',
        url: 'http://newstudio.tv//viewforum.php?f=380',
        source: 'newstudio' },
    { rus_name: 'Бедлам',
        url: 'http://newstudio.tv//viewforum.php?f=224',
        source: 'newstudio',
        orig_name: 'Bedlam' },
    { rus_name: 'Без координат',
        url: 'http://newstudio.tv//viewforum.php?f=191',
        source: 'newstudio',
        orig_name: 'Off the Map' },
    { rus_name: 'Безмозглые',
        url: 'http://newstudio.tv//viewforum.php?f=477',
        source: 'newstudio',
        orig_name: 'Braindead' }];

exports.parseSerialNamesFromIndexPage = function () {
    return new Promise((resolve, reject) => {
        request({uri:'http://newstudio.tv/', headers : { Cookie : ENV_VARIABLES.newstudio.cookies },
                method:'GET'}, (err, res, page) => {
            if (!err && res.statusCode == 200){
                let serials = [];
                let $ = cheerio.load(page,{decodeEntities: false});
                let serial_lis = $('#sideRight li a');
                serial_lis.each((i, elem) => {
                    serials.push({
                        rus_name: $(elem).text(),
                        url: 'http://newstudio.tv'+$(elem).attr('href'),
                        source:'newstudio'
                    })
                });
                resolve(serials);
            }
            else reject(err);
        })
    });
};

exports.getSerialsOriginalNames = function (serials) {
    let test = 0;
    function getSerialName(serial){
        return new Promise((resolve, reject)=>{
            request({uri:serial.url, headers : { Cookie : ENV_VARIABLES.newstudio.cookies },
                method:'GET'}, (err, res, page) => {
                if (!err && res.statusCode == 200){
                    let $ = cheerio.load(page,{decodeEntities: false});
                    let topics = $('.torTopic b');
                    if ($(topics).length){
                        let first_topic = $(topics).get(0);
                        let test = $(first_topic).text().match(/\/ ([^\(]+)/);
                        serial.topic_url = 'http://newstudio.tv' + $(first_topic).parent().attr('href').slice(1);
                        serial.orig_name = $(first_topic).text().match(/\/ ([^\(]+)/)[1]
                            .trim()
                            .replace('&#039;','\'')
                            .replace('&amp;','&');
                    }
                }
                resolve(serial);
            });
        });

    }
    function waitSomeTimeBecauseOfDos() {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, 250);
        })
    }
    let sequence = Promise.resolve();
    for (let i = 0; i < serials.length; i++){
        sequence = sequence
            .then(() => getSerialName(serials[i]))
            .then(serial => console.log(serial))
            .then(() => waitSomeTimeBecauseOfDos())
    }
    return sequence.then(() => Promise.resolve(serials));
};

exports.getOMDBData = function (serials) {
    function getOMDBObject(serial) {
        return new Promise((resolve, reject) => {
            request({uri:'http://www.omdbapi.com/?t='+serial.orig_name+'&y=&plot=short&r=json',
                method:'GET'}, (err, res, page) => {
                if (!err && res.statusCode == 200){
                    serial.omdb_data = JSON.parse(page);
                }
                resolve(serial);
            });
        });
    }
    let sequence = Promise.resolve();
    for (let i = 0; i < serials.length; i++){
        sequence  = sequence.then(() => getOMDBObject(serials[i]))
    }
    return sequence.then(() => Promise.resolve(serials));
};


/*exports.parseSerialNamesFromIndexPage()
    .then(serials => exports.getSerialsOriginalNames(serials))
    .then(serials => serials.filter(serial => serial.orig_name))
    .then(serials => console.log(serials));*/

exports.getOMDBData(sampleSerials)
    .then(serials => serials.filter(serial => serial.omdb_data && !serial.omdb_data.Error))
    .then(serials => serials.filter(serial => serial.omdb_data.Year.length <= 5))
    .then(serials => console.log(serials));