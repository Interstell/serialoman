const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');

exports.fillEpisodeWithModelInfo = function(episode) {
    return new Promise((resolve, reject) => {
        request({uri:episode.episode_url,
            headers : { Cookie : process.env.NEWSTUDIO_COOKIES },
            method:'GET'}, (err, res, page) => {
            if (!err && res.statusCode == 200) {
                let $ = cheerio.load(page, {decodeEntities: false});
                let post_text = $($('.post_wrap').get(0)).text();
                episode.season = parseInt(post_text.match(/Сезон: ([\d]+)/)[1]);
                let date = $('.add-on span').text();
                let date_regex = /((Сегодня)|(Вчера)) ([\d]{2}):([\d]{2})/;
                if (date.includes('Сегодня')){
                    let hours = date.match(date_regex)[4];
                    let minutes = date.match(date_regex)[5];
                    episode.release_date = new Date(moment().utcOffset(180).set('hours', hours).set('minutes', minutes));
                }
                else if (date.includes('Вчера')){
                    let hours = date.match(date_regex)[4];
                    let minutes = date.match(date_regex)[5];
                    episode.release_date = new Date(moment().utcOffset(180).set('hours', hours).set('minutes', minutes).add(-1, 'days'));
                }
                else{
                    episode.release_date = new Date(date);
                }
                let name = post_text.match(/Название серии: ([^А-Я]+)/)
                episode.episode_name = name?name[1]:null;
            }
            resolve();
        });
    });
};

exports.groupEpisodes = function(episodes){
    for (let i = 0; i < episodes.length; i++){
        for (let j = i + 1; j < episodes.length; j++){
            if (episodes[i] && episodes[j]){
                if (episodes[i].serial_name == episodes[j].serial_name
                    && episodes[i].season == episodes[j].season
                    && episodes[i].episode_number == episodes[j].episode_number){
                    episodes[i].download_urls.push(episodes[j].download_urls[0]);
                    episodes[j] = null;
                }
            }
        }
    }
    return Promise.resolve(episodes);
};

exports.fillEpisodesWithModelInfo = function (episodes) {
    let sequence = Promise.resolve();
    for (let i = 0; i < episodes.length; i++){
        sequence = sequence
            .then(() => exports.waitSomeTimeBecauseOfDos())
            .then(() => exports.fillEpisodeWithModelInfo(episodes[i]));
    }
    sequence = sequence.then (() => Promise.resolve(episodes));
    return sequence;
};

exports.waitSomeTimeBecauseOfDos = function () {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, 250);
    })
};

exports.getAllEpisodesOfSerial = function (serial) {
    let all_episodes = [];
    function getPagesCount() {
        return new Promise((resolve, reject) => {
            request({uri:serial.url, headers : { Cookie : process.env.NEWSTUDIO_COOKIES },
                method:'GET'}, (err, res, page) => {
                if (!err && res.statusCode == 200) {
                    let $ = cheerio.load(page, {decodeEntities: false});
                    let page_links = $('.pagination ul li');
                    resolve(($(page_links).length === 0)?1:($(page_links).length-2)/2);
                }
            });
        });
    }
    function parseEpisodesOnPage(page){
        return new Promise((resolve, reject) => {
            request({uri:serial.url+'&sort=2&start='+page*50, headers : { Cookie : process.env.NEWSTUDIO_COOKIES },
                method:'GET'}, (err, res, page) => {
                if (!err && res.statusCode == 200) {
                    let $ = cheerio.load(page, {decodeEntities: false});
                    $('.topic_id').each((i, elem)=>{
                        let episode = {};
                        episode.source = 'newstudio';
                        let topic_name = $(elem).find('.torTopic b').text();
                        let topic_matches = topic_name.match(/([^(]+) \(Сезон ([\d]+), Серия ([\d]+)\) \/ ([^(]+)\([\d]+\) ([\w]+)([ ][\d]+p)?/);
                        if (topic_matches){
                            episode.serial_name = topic_matches[4].trim().replace(/&#039;/,'\'');
                            episode.serial_rus_name = topic_matches[1].trim();
                            episode.serial_orig_name = episode.serial_name;
                            episode.season = parseInt(topic_matches[2]);
                            episode.episode_number = parseInt(topic_matches[3]);
                            episode.download_urls = [];
                            episode.download_urls.push({
                                quality: (topic_matches[5] + (topic_matches[6] || '')).trim()
                            })
                        }
                        else {
                            topic_matches = topic_name.match(/([^(]+) \(([А-Яа-я]+) [^\/]+ \/ ([^(]+)\([\d]+\) ([\w]+)([ ][\d]+p)?/);
                            if (!topic_matches)
                                return;
                            episode.serial_name = topic_matches[3].trim().replace(/&#039;/,'\'');
                            episode.serial_rus_name = topic_matches[1].trim();
                            episode.serial_orig_name = episode.serial_name;
                            episode.season = topic_matches[2];
                            episode.episode_number = 0;
                            episode.full_season = true;
                            episode.download_urls = [];
                            episode.download_urls.push({
                                quality: (topic_matches[4]+ (topic_matches[5] || '')).trim()
                            });
                        }
                        episode.download_urls[0].size = $(elem).find('.span1 .small').text().slice(1).replace(/&nbsp;/,' ').replace(/GB/,'ГБ').replace(/MB/,'МБ');
                        episode.download_urls[0].link = 'http://newstudio.tv' + $(elem).find('.span1 a').attr('href').slice(1);
                        episode.episode_url = 'http://newstudio.tv' + $(elem).find('.torTopic').attr('href').slice(1);
                        episode.download_page_url = episode.episode_url;
                        episode.icon = `http://newstudio.tv/images/posters/${serial.url.match(/([\d]+)/)}.jpg`.replace(/,[\d]+/,'');
                        all_episodes.push(episode);
                    });
                    resolve();
                }
            });
        });
    }

    return getPagesCount()
        .then(count => {
            let sequence = exports.waitSomeTimeBecauseOfDos();
            for (let i = 0; i < count; i++){
                sequence = sequence
                    .then(() => parseEpisodesOnPage(i))
                    .then(() => exports.waitSomeTimeBecauseOfDos());
            }
            sequence = sequence.then(() => Promise.resolve(all_episodes));
            return sequence;
        })
        .then(episodes => exports.groupEpisodes(episodes))
        .then(episodes => episodes.filter(episode => episode))
        .then(episodes => exports.fillEpisodesWithModelInfo(episodes))
        .then(episodes => episodes.filter(episode => episode.release_date));
};

exports.parseReleasesOnPage = function (page) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'http://newstudio.tv/tracker.php?start=' + page * 50, headers: {Cookie: process.env.NEWSTUDIO_COOKIES},
            method: 'GET'
        }, (err, res, page) => {
            if (!err && res.statusCode == 200) {
                let $ = cheerio.load(page, {decodeEntities: false});
                let releases_on_page = [];
                $('.hl-tr').each((i, elem)=> {
                    let episode = {};
                    episode.source = 'newstudio';
                    let topic_name = $(elem).find('.genmed b').text();
                    let topic_matches = topic_name.match(/([^(]+) \(Сезон ([\d]+), Серия ([\d]+)\) \/ ([^(]+)\([\d]+\) ([\w]+)([ ][\d]+p)?/);
                    if (topic_matches){
                        episode.serial_name = topic_matches[4].trim().replace(/&#039;/,'\'');
                        episode.serial_rus_name = topic_matches[1].trim();
                        episode.serial_orig_name = episode.serial_name;
                        episode.season = parseInt(topic_matches[2]);
                        episode.episode_number = parseInt(topic_matches[3]);
                        episode.download_urls = [];
                        episode.download_urls.push({
                            quality: (topic_matches[5] + (topic_matches[6] || '')).trim()
                        })
                    }
                    else {
                        topic_matches = topic_name.match(/([^(]+) \(([А-Яа-я]+) [^\/]+ \/ ([^(]+)\([\d]+\) ([\w]+)([ ][\d]+p)?/);
                        if (!topic_matches)
                            return;
                        episode.serial_name = topic_matches[3].trim().replace(/&#039;/,'\'');
                        episode.serial_rus_name = topic_matches[1].trim();
                        episode.serial_orig_name = episode.serial_name;
                        episode.season = topic_matches[2];
                        episode.episode_number = 0;
                        episode.full_season = true;
                        episode.download_urls = [];
                        episode.download_urls.push({
                            quality: (topic_matches[4]+ (topic_matches[5] || '')).trim()
                        });
                    }
                    episode.download_urls[0].size = $(elem).find('.tr-dl').text().replace(/&nbsp;/,' ').replace(/GB/,'ГБ').replace(/MB/,'МБ');
                    episode.download_urls[0].link = 'http://newstudio.tv' + $(elem).find('.tr-dl').attr('href').slice(1);
                    episode.episode_url = 'http://newstudio.tv' + $(elem).find('.genmed').attr('href').slice(1);
                    episode.download_page_url = episode.episode_url;
                    episode.icon = 'http://newstudio.tv' + $(elem).find('.gen img').attr('src');
                    releases_on_page.push(episode);
                });
                resolve(releases_on_page);
            }

        });
    });
};