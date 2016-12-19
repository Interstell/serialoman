const moment = require('moment');
const Episode = require('../../models/episode.model');
const Serial = require('../../models/serial.model');
const episodeDbManager = require('../episode/episode.db.manager');
const nsEpisodeParser = require('../newstudio/newstudio.episode.parser');

function getAllSerialsFromDb() {
    return new Promise((resolve, reject)=>{
        Serial
            .find({$and: [{newstudio_url:new RegExp('newstudio','i')}, {is_on_air: true}]})
            .exec((err, data) => {
                if (err)
                    reject(err);
                else resolve(data);
            })
    })
}

exports.parseAllEpisodesAndAddToDb = function () {
    let sequence = Promise.resolve();
    let cur_episodes;
    getAllSerialsFromDb()
        .then(serials => serials.forEach(serial => {
            sequence = sequence.then(
                () => nsEpisodeParser.getAllEpisodesOfSerial(serial)
                    .then(episodes => cur_episodes = episodes)
                    .then(episodes => episodes.map(episode => episodeDbManager.checkForEpisodeExistanceInDB(episode)))
                    .then(episodes_bool => Promise.all(episodes_bool))
                    .then(episodes_bool => episodes_bool.map((val, index) => {
                        return {
                            exists: val,
                            episode: cur_episodes[index]
                        }
                    }))
                    .then(episodes => episodes.filter(episode => !episode.exists))
                    .then(episodes => episodes.map(episode => episode.episode))
                    .then(episodes => episodes.filter(episode => episode.release_date != 'Invalid Date'))
                    .then(episodes => episodes.map(episode => episodeDbManager.addNewEpisodeToDB(episode)))
                    .then(episodes => Promise.all(episodes))
            )
        }))
};

exports.checkForNewEpisodes = function () {
    function getAllReleases() {
        let all_releases = [];
        let sequence = nsEpisodeParser.waitSomeTimeBecauseOfDos();
        for (let i = 0; i < 10; i++){ //10 pages of releases
            sequence = sequence
                .then(() => nsEpisodeParser.parseReleasesOnPage(i))
                .then(releases => all_releases = all_releases.concat(releases))
                .then(() => nsEpisodeParser.waitSomeTimeBecauseOfDos());
        }
        sequence = sequence.then(() => Promise.resolve(all_releases));
        return sequence;
    }
    let all_releases;
    getAllReleases()
        .then(releases => nsEpisodeParser.groupEpisodes(releases))
        .then(releases => releases.filter(release => release))
        .then(releases => all_releases = releases)
        .then(releases => releases.map(release => episodeDbManager.checkForEpisodeExistanceInDB(release)))
        .then(releases_bool => Promise.all(releases_bool))
        .then(releases_bool => releases_bool.map((val, index) => {
            return {
                exists: val,
                episode: all_releases[index]
            }
        }))
        .then(releases => releases.filter(release => !release.exists))
        .then(releases => releases.map(release => release.episode))
        .then(releases => nsEpisodeParser.fillEpisodesWithModelInfo(releases))
        .then(releases => releases.filter(release => release.release_date)) //because of 403
        .then(releases => releases.map(release => episodeDbManager.addNewEpisodeToDB(release)))
        .then(releases => Promise.all(releases))
        .then(releases =>{
            console.log(`[NS Parser]: ${releases.length} new episodes parsed and added to DB.`);
            releases.forEach(episode => console.log(`\t${episode.serial_name} S${episode.season}E${(episode.episode_number)?episode.episode_number:0} (${moment(episode.release_date).format('DD/MM/YYYY HH:mm:ss Z')})`));
        });
};

//exports.checkForNewEpisodes();