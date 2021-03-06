const request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    moment = require('moment');

exports.parseSerialNamesFromIndexPage = function () {
    return new Promise((resolve, reject) => {
        request({uri:'http://newstudio.tv/', headers : { Cookie : process.env.NEWSTUDIO_COOKIES },
                method:'GET'}, (err, res, page) => {
            if (!err && res.statusCode == 200){
                let serials = [];
                let $ = cheerio.load(page,{decodeEntities: false});
                let serial_lis = $('#sideRight li a');
                serial_lis.each((i, elem) => {
                    serials.push({
                        rus_name: $(elem).text(),
                        url: 'http://newstudio.tv'+$(elem).attr('href'),
                        newstudio_url: 'http://newstudio.tv'+$(elem).attr('href'),
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
            request({uri:serial.url, headers : { Cookie : process.env.NEWSTUDIO_COOKIES },
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
    function getInfoFromEpisodePage(serial){
        return new Promise((resolve, reject)=>{
            request({uri:serial.topic_url, headers : { Cookie : process.env.NEWSTUDIO_COOKIES, timeout: 10000 },
                method:'GET'}, (err, res, page) => {
                if (!err && res.statusCode == 200) {
                    let $ = cheerio.load(page, {decodeEntities: false});
                    let body = $('.post_body').text();
                    let content = body.match(/Год выхода: ([\d]+)/);
                    serial.start_year = content?parseInt(content[1]):null;
                    content = body.match(/Жанр: ([А-Яа-я+ ,\/]+)((Режиссер)|(Создатель))/);
                    serial.genres = content?content[1].match(/([^,]+)/g).map(el => el.trim().toLowerCase()):null;
                    content = body.match(/Режиссер: ([^:]+)В ролях/);
                    serial.directors = content?content[1]:null;
                    content = body.match(/В ролях: ([^:]+)О фильме/);
                    serial.actors = content?content[1]:null;
                    content = body.match(/О фильме:([^|]+)Над релизом/);
                    serial.plot = content?content[1]:null;
                    serial.poster = $($('.postImg').get(0)).attr('title');
                    let last_post_year = $($('.viewtopic .small')[0]).text().match(/(20[\d]{2})/);
                    if (last_post_year){
                        serial.active_translation = (parseInt(moment().format('YYYY')) - parseInt(last_post_year[1]) <= 2);
                    }
                    else serial.active_translation = true;
                }
                resolve(serial);
            });
        })
    }
    let current_serial;
    let sequence = Promise.resolve();
    for (let i = 0; i < serials.length; i++){
        sequence = sequence
            .then(() => getSerialName(serials[i]))
            .then(serial => {
                current_serial = serial;
            })
            .then(() => waitSomeTimeBecauseOfDos())
            .then(() => getInfoFromEpisodePage(current_serial))
            //.then(serial => console.log(serial))
            .then(() => waitSomeTimeBecauseOfDos());
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

exports.filterOMDBData = function(serials){
    return serials.filter(serial => serial.omdb_data
        && !serial.omdb_data.Error
        && serial.omdb_data.Year.length == 5 //e.g. 2012-
        && serial.omdb_data.Type == 'series'
    );
};

exports.fillObjectToSuitModel = function (serial) {
        serial.name = serial.rus_name + ' ('+serial.orig_name+')';
        //serial.poster = serial.omdb_data.Poster;
        serial.prod_country= (serial.omdb_data.Country && serial.omdb_data.Country != 'N/A')?serial.omdb_data.Country:null;
        serial.seasons_num= parseInt(serial.omdb_data.totalSeasons);
        serial.is_on_air= true;
        serial.own_site= null;
        serial.description = null;
        serial.scriptwriters= (serial.omdb_data.Writer && serial.omdb_data.Writer != 'N/A')?serial.omdb_data.Writer:null;
        return Promise.resolve(serial);
};