const request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
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
            request({uri:serial.topic_url, headers : { Cookie : process.env.NEWSTUDIO_COOKIES },
                method:'GET'}, (err, res, page) => {
                if (!err && res.statusCode == 200) {
                    let $ = cheerio.load(page, {decodeEntities: false});
                    let body = $('.post_body').text();
                    let content = body.match(/Год выхода: ([\d]+)/);
                    serial.start_year = content?parseInt(content[1]):null;
                    content = body.match(/Жанр: ([А-Яа-я+ ,]+)Режиссер/);
                    serial.genres = content?content[1].match(/([^,]+)/g).map(el => el.trim().toLowerCase()):null;
                    content = body.match(/Режиссер: ([^:]+)В ролях/);
                    serial.directors = content?content[1]:null;
                    content = body.match(/В ролях: ([^:]+)О фильме/);
                    serial.actors = content?content[1]:null;
                    content = body.match(/О фильме:([^|]+)Над релизом/);
                    serial.description = content?content[1]:null;
                    resolve(serial);
                }
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
            .then(serial => console.log(serial))
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
    return{
        name: serial.rus_name + ' ('+serial.orig_name+')',
        rus_name:serial.rus_name,
        orig_name: serial.orig_name,
        url: serial.url,
        source: serial.source,
        poster: serial.omdb_data.Poster, //todo change to newstudio's
        prod_country: serial.omdb_data.Country,
        //start_year: parseInt(serial.omdb_data.Year.match(/([\d]+)/)[1]),
        //genres: serial.omdb_data.Genre.match(/([^,]+)/g).map(el => el.trim()),
        seasons_num: parseInt(serial.omdb_data.totalSeasons),
        is_on_air: true,
        own_site: null,
        //description: null,
        //actors: (serial.omdb_data.Actors && serial.omdb_data.Actors != 'N/A')?serial.omdb_data.Actors:null,
        //directors: (serial.omdb_data.Director && serial.omdb_data.Director != 'N/A')?serial.omdb_data.Director:null,
        scriptwriters: (serial.omdb_data.Writer && serial.omdb_data.Writer != 'N/A')?serial.omdb_data.Writer:null,
        plot: (serial.omdb_data.Plot && serial.omdb_data.Plot != 'N/A')?serial.omdb_data.Plot:null
    }
};


exports.parseSerialNamesFromIndexPage()
    .then(serials => exports.getSerialsOriginalNames(serials))
    .then(serials => serials.filter(serial => serial.orig_name))
    .then(serials => console.log(serials));

/*exports.getOMDBData(sampleSerials)
    .then(serials => exports.filterOMDBData(serials))
    .then(serials => serials.map(serial => exports.fillObjectToSuitModel(serial)))
    .then(serials => console.log(serials));*/