const request = require('request'),
    cheerio = require('cheerio'),
    windows1251 = require('windows-1251'),
    fs = require('fs'),
    ENV_VARIABLES = require('../env_variables.js');

exports.getAllEpisodesOnPage = function (episodes, offset) {
    return new Promise((resolve, reject) => {
        let startIndex = episodes.length;
        request({uri:'http://www.lostfilm.tv/browse.php?o='+offset,
                method:'GET', encoding:'binary'
        },
            function (err, res, page) {
                page = windows1251.decode(page);
                page = page.replace(/(<!--)|(-->)/g,'');
                if (!err && res.statusCode == 200) {
                    let $ = cheerio.load(page,{decodeEntities: false});
                    let spans = $('.content_body span');
                    for (let k = 0; k < (spans.length-1)/2; k++)
                        episodes.push({source: 'lostfilm'});
                    spans.each((i, elem, arr) =>{
                       if (i >= 30){
                           return;
                       }
                       else if (i % 2 == 0){
                           episodes[startIndex + i/2].serial_rus_name = $(elem).text().trim();
                       }
                       else episodes[startIndex + (i-1)/2].episode_name = $(elem).text().trim();
                    });

                    let episode_divs = $('.content_body div');
                    episode_divs.each((i, elem) => {
                       if (i % 2 == 0 && i != episode_divs.length - 1){
                           let data = $(elem).text().trim().match(/([\d]+).([\d]+)/);
                           let is_full = $(elem).text().trim().includes('сезон');
                           if (is_full){
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
                    let download_links = $('.content_body a.a_download');
                    download_links.each((i, elem) => {
                        if (i % 2 == 0){
                            if (episodes[startIndex+ i/2].full_season){
                                episodes[startIndex + i/2].serial_name = $(elem).attr('href').match(/id=[\d]+&([\w-. ]+)(?=[\d])/)[1].trim();
                                episodes[startIndex + i/2].serial_orig_name = episodes[startIndex + i/2].serial_name;
                                //todo check for real name for full_season_episodes
                            }
                            else {
                                let link_match = $(elem).attr('href').replace(/ /g,'')
                                    .match(/id=[\d]+&([\S]+).S[\d]+/);
                                if (!link_match) {
                                    link_match = $(elem).attr('href').match(/id=[\d]+&([^-]+)(?= [\d])/);
                                    episodes[startIndex + i/2].serial_name = link_match[1].trim();
                                }
                                else{
                                    episodes[startIndex + i/2].serial_name = link_match[1].replace(/\./g,' ');
                                }
                                episodes[startIndex + i/2].serial_orig_name = episodes[startIndex + i/2].serial_name;
                            }
                        }
                        else { //getting download page link
                            let link_params = $(elem).attr('onclick').match(/ShowAllReleases\('([\d_]+)','([\d.]+)','([\d-]+)'\)/);
                            episodes[startIndex + (i-1)/2].download_page_url = 'http://www.lostfilm.tv/nrdr2.php?c='+link_params[1]+'&s='+link_params[2]+'&e='+link_params[3];
                        }
                    });
                    resolve(episodes);
                }
                else reject(err);
            });
    });
};

exports.addDownloadLinksToEpisode = function (episode) {
    return new Promise((resolve, reject)=>{
        request({
                url : episode.download_page_url,
                headers : {
                    Cookie : ENV_VARIABLES.lostfilm.cookies
                }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200){
                    let test = body.match(/(http:\/\/retre.org[\S]+)"/); //todo wtf??
                    if (test)
                        episode.download_page_url = body.match(/(http:\/\/retre.org[\S]+)"/)[1];
                    request({ url : episode.download_page_url, method:'GET', encoding:'binary'},
                        function (error, response, body) {
                            if (!error && response.statusCode == 200){
                                let $ = cheerio.load(body,{decodeEntities: false});
                                let table_rows = $('table td');
                                let download_urls = [];
                                table_rows.each((i, elem) => {
                                    i = i-6;
                                    if (i >= 0 && i % 2 == 1){
                                        let size = $(elem).find('span').text().match(/Ðàçìåð: ([\S ]+)./)[1];
                                        size = size.replace(/ÌÁ/,'МБ');
                                        size = size.replace(/ÃÁ/,'ГБ');
                                        let url = {
                                            link: $(elem).find('a').attr('href'),
                                            quality: $(elem).find('span').text().match(/Âèäåî: ([^.]+)/)[1],
                                            size: size
                                        };
                                        download_urls.push(url);
                                    }
                                });
                                episode.download_urls = download_urls;
                                resolve(episode);
                            }
                            else reject(error);
                        }
                    );
                }
                else reject(error);
            }
        );
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
                    .then((results) => results.map((result) => exports.addDownloadLinksToEpisode(result)))
                    .then((results) => Promise.all(results))
            }
            return sequence;
        };
        run()
            .then(() => {
                resolve(episodes);
            });
    });
};

/*exports.addDownloadLinksToEpisode({download_page_url: 'http://www.lostfilm.tv/nrdr2.php?c=224&s=3.00&e=06'})
    .then (episode => console.log(episode));*/

/*exports.getAllEpisodes(0, 15)
    .then(arr => fs.writeFile('../data_samples/episodes_example.json',JSON.stringify(arr, null, 4))) ;*/
    //.then(arr => console.log(arr));