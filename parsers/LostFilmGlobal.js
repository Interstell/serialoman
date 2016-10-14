const request = require('request'),
    cheerio = require('cheerio'),
    windows1251 = require('windows-1251'),
    fs = require('fs');

var getPopularSeries = function(){
    return new Promise((resolve, reject) => {
        let serials = [];
        request({uri:'http://www.lostfilm.tv', method:'GET', encoding:'binary'},
            function (err, res, page) {
                if (!err && res.statusCode == 200) {
                    var $ = cheerio.load(page,{decodeEntities: false});
                    $(".bb a.bb_a").each(function(i, elem){
                        var text = windows1251.decode($(this).text());
                        serials.push({
                            name: text,
                            rus_name: text.match(/([^()]+)[(](.+)[)]/i)[1],
                            orig_name: text.match(/([^()]+)[(](.+)[)]/i)[2],
                            url: 'http://www.lostfilm.tv'+$(this).attr("href"),
                            ls_cat_id: $(this).attr("href").match(/cat=([_]?[0-9]*)/)[1],
                            source: 'lostfilm'
                        });
                    });
                    resolve(serials);
                }
                else reject(Error('Error in parsing popular serials list'));
            });
    });
};

var getSeriesInfo = function(serial){
    return new Promise((resolve, reject) => {
        request({uri:serial.url, method:'GET',encoding:'binary'},
            function(err,res,page){
                if (!err && res.statusCode == 200){
                    var $ = cheerio.load(page, {decodeEntities:false});
                    serial.poster = 'http://www.lostfilm.tv' + $(".mid > div > img").attr("src");
                    var main_info = windows1251.decode($(".mid > div").text());
                    serial.prod_country = main_info.match(/Страна: ([А-Яа-я, ]*)/)[1];
                    serial.start_year = parseInt(main_info.match(/Год выхода: ([0-9]*)/)[1]);
                    serial.genre = main_info.match(/Жанр: ([А-Яа-я \/]*)/)[1];
                    serial.seasons_num = parseInt(main_info.match(/Количество сезонов: ([0-9]*)/)[1]);
                    var onair = main_info.match(/Статус: ([а-я]*)/)[1];
                    serial.is_on_air = (onair === 'снимается');
                    serial.own_site = main_info.match(/Сайт сериала: ([a-z:\/\d.]*)/)[1];
                    var description = windows1251.decode($(".mid > div").find(".content").next().text()).replace(/(\r)|(\t)|/g,'');
                    serial.text = description;
                    serial.description = description.match(/[\n ]*(.*)/)[0];
                    var actors = description.match(/Акт[её]ры:[\n ]*(.*)/);
                    serial.actors = (actors)?actors[1].trim():null;
                    var directors = description.match(/Режисс[её]р[ы]?:[\n ]*(.*)/);
                    serial.directors = (directors)?directors[1].trim():null;
                    var scriptwriters = description.match(/Сценарист[ы]?:[\n ]*(.*)/);
                    serial.scriptwriters = (scriptwriters)?scriptwriters[1].trim():null;
                    var plot = description.match(/Сюжет:[\n ]*(.*)/);
                    serial.plot = (plot)?plot[1].trim():null;
                    resolve(serial);
                }
                else reject(Error('Error in parsing '+serial.url));
            });
    });
};



var getAllPopularSeries = function(){
    return new Promise((resolve, reject) => {
        getPopularSeries()
            .then(serials => serials.map(serial => getSeriesInfo(serial)))
            .then(serialsProm => Promise.all(serialsProm))
            .then(serials => resolve(serials))
            .catch(err => reject(err));
    });
};

/* Usage */
/*getAllPopularSeries()
    .then((serials) => {
        fs.writeFile('data.json',JSON.stringify(serials, null, 4));
    });*/

module.exports = {
    getAllPopularSeries:getAllPopularSeries
};