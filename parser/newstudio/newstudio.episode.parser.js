const request = require('request');
const cheerio = require('cheerio');

const sample = {
    "serial_id" : 181,
    "rus_name" : "Форс-мажоры",
    "url" : "http://newstudio.tv/viewforum.php?f=206",
    "source" : "newstudio",
    "orig_name" : "Suits",
    "start_year" : 2016,
    "directors" : "Кевин Брэй, Джон Скотт",
    "actors" : "Патрик Дж. Адамс, Гэбриел Махт, Меган Маркл, Джина Торрес, Рик Хоффман",
    "plot" : "В центре сюжета замечательный, но немотивированный молодой человек, так и не закончивший учебу в колледже. У него есть все необходимые качества, чтобы стать хорошим адвокатом, кроме диплома. Но благодаря знаниям законов улицы и напористым, не всегда честным действиям его нанимает влиятельная юридическая фирма из Манхэттена.",
    "name" : "Форс-мажоры (Suits)",
    "poster" : "https://images-na.ssl-images-amazon.com/images/M/MV5BMTk1MjYzOTU2Nl5BMl5BanBnXkFtZTgwMzAxMTg5MTE@._V1_SX300.jpg",
    "prod_country" : "USA",
    "seasons_num" : 6,
    "is_on_air" : true,
    "own_site" : null,
    "description" : null,
    "scriptwriters" : "Aaron Korsh",
    "genres" : [
        "драма"
    ],
    "__v" : 0
};

const sampleEp = { source: 'newstudio',
    serial_name: 'Suits',
    serial_rus_name: 'Форс-мажоры',
    serial_orig_name: 'Suits',
    season: 6,
    episode_number: 10,
    download_urls:
        [ { quality: 'WEBDL 1080p',
            size: '1.84 ГБ',
            link: 'http://newstudio.tv/download.php?id=20455' },
            { quality: 'WEBDL 720p',
                size: '1.5 ГБ',
                link: 'http://newstudio.tv/download.php?id=20454' },
            { quality: 'WEBDLRip',
                size: '607 МБ',
                link: 'http://newstudio.tv/download.php?id=20453' } ],
    episode_url: 'http://newstudio.tv/viewtopic.php?t=20567' };



exports.fillEpisodeWithModelInfo = function(episode) {
    return new Promise((resolve, reject) => {
        request({uri:episode.episode_url, headers : { Cookie : process.env.NEWSTUDIO_COOKIES },
            method:'GET'}, (err, res, page) => {
            if (!err && res.statusCode == 200) {
                let $ = cheerio.load(page, {decodeEntities: false});
                episode.icon = $($('.postImg').get(0)).attr('title');
                let post_text = $($('.post_wrap').get(0)).text();
                episode.season = parseInt(post_text.match(/Сезон: ([\d]+)/)[1]);
                episode.release_date = new Date($('.add-on span').text())
                console.log(episode);
            }
            resolve();
        });
    });
};

exports.getAllEpisodesOfSerial = function (serial) {
    let all_episodes = [];
    function waitSomeTimeBecauseOfDos() {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, 250);
        })
    }
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
                            episode.serial_name = topic_matches[4].trim();
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
                            episode.serial_name = topic_matches[3].trim();
                            episode.serial_rus_name = topic_matches[1].trim();
                            episode.serial_orig_name = episode.serial_name;
                            episode.season = topic_matches[2];
                            episode.episode_number = 0;
                            episode.full_season = true;
                            episode.download_urls = [];
                            episode.download_urls.push({
                                quality: (topic_matches[4]+ (topic_matches[5] || '')).trim()
                            })
                        }
                        episode.download_urls[0].size = $(elem).find('.span1 .small').text().slice(1).replace(/&nbsp;/,' ').replace(/GB/,'ГБ').replace(/MB/,'МБ');
                        episode.download_urls[0].link = 'http://newstudio.tv' + $(elem).find('.span1 a').attr('href').slice(1);
                        episode.episode_url = 'http://newstudio.tv' + $(elem).find('.torTopic').attr('href').slice(1);
                        episode.download_page_url = episode.episode_url;
                        all_episodes.push(episode);
                    });
                    resolve();
                }
            });
        });
    }
    function groupEpisodes(episodes){
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
    }
    function fillEpisodesWithModelInfo(episodes) {
        let sequence = Promise.resolve();
        for (let i = 0; i < episodes.length; i++){
            sequence = sequence
                .then(() => waitSomeTimeBecauseOfDos())
                .then(() => exports.fillEpisodeWithModelInfo(episodes[i]));
        }
        sequence = sequence.then (() => Promise.resolve(episodes));
        return sequence;
    }
    getPagesCount()
        .then(count => {
            let sequence = waitSomeTimeBecauseOfDos();
            for (let i = 0; i < count; i++){
                sequence = sequence
                    .then(() => parseEpisodesOnPage(i))
                    .then(() => waitSomeTimeBecauseOfDos());
            }
            sequence = sequence.then(() => Promise.resolve(all_episodes));
            return sequence;
        })
        .then(episodes => groupEpisodes(episodes))
        .then(episodes => episodes.filter(episode => episode))
        .then(episodes => fillEpisodesWithModelInfo(episodes));
};




exports.getAllEpisodesOfSerial(sample);
//exports.fillEpisodeWithModelInfo(sampleEp);