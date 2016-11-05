const request = require('request'),
    cheerio = require('cheerio'),
    windows1251 = require('windows-1251'),
    fs = require('fs');

exports.getAllEpisodesOnPage = function (episodes, offset) {
    return new Promise((resolve, reject) => {
        let startIndex = episodes.length;
        request({uri:'http://www.lostfilm.tv/browse.php?o='+offset, method:'GET', encoding:'binary'},
            function (err, res, page) {
                page = windows1251.decode(page);
                if (!err && res.statusCode == 200) {
                    let $ = cheerio.load(page,{decodeEntities: false});
                    let spans = $('.content_body span');
                    for (let k = 0; k < (spans.length-1)/2; k++)
                        episodes.push({lostfilm: true});
                    spans.each((i, elem) =>{
                       if (i == spans.length -1)
                           return;
                       else if (i % 2 == 0){
                           episodes[startIndex + i/2].serial_name = $(elem).text().trim();
                       }
                       else episodes[startIndex + (i-1)/2].episode_name = $(elem).text().trim();
                    });
                    let episode_divs = $('.content_body div');
                    episode_divs.each((i, elem) => {
                       if (i % 2 == 0 && i != episode_divs.length - 1){
                           let data = $(elem).text().trim().match(/([\d]+).([\d]+)/)
                           if (!data){
                               episodes[startIndex + i/2].season = parseInt($(elem).text().trim().match(/([\d]+) сезон/)[1]);
                               episodes[startIndex + i/2].full_season = true;
                           }
                           else{
                               episodes[startIndex + i/2].season = parseInt(data[1]);
                               episodes[startIndex + i/2].episode_number = parseInt(data[2]);
                           }
                       }
                    });
                    let icons = $('.content_body img');
                    icons.each((i, elem) => {
                       episodes[startIndex + i].icon = 'http://www.lostfilm.tv'+$(elem).attr('src');
                    });
                    let release_dates = $('.content_body b');
                    release_dates.each((i, elem) => {
                       if (i % 3 == 1){
                           episodes[startIndex + (i-1)/3].release_date = $(elem).text();
                       }
                    });
                    let detailed_links = $('.content_body a.a_details');
                    detailed_links.each((i, elem) => {
                       episodes[startIndex + i].episode_url = 'http://www.lostfilm.tv'+$(elem).attr('href');
                    });
                    resolve(episodes);
                }
                else reject(err);
            });
    });
};



exports.getAllEpisodes = function(start, finish){
    return new Promise((resolve, reject) => {
        let episodes = [];
        let run = function () {
            let sequence = Promise.resolve();
            for (let i = start; i <= finish; i+=15){
                sequence = sequence
                    .then(() => exports.getAllEpisodesOnPage(episodes, i))
            }
            return sequence;
        };
        run()
            .then(() => {
                resolve(episodes);
            });
    });
};

exports.getAllEpisodes(0, 45)
    .then(x => console.log(x));