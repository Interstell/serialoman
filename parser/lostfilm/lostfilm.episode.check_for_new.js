const LFEpisodeParser = require('./lostfilm.episode.parser');
const episodeDBManager = require('../episode/episode.db.manager');
const moment = require('moment');



exports.parseAllEpisodes = function(){ //dev function for initialize parsing
    let all_episodes;
    LFEpisodeParser.getAllEpisodes(0, 120)
        .then(episodes => all_episodes = episodes)
        .then(episodes => episodes.map(episode => episodeDBManager.checkForSerialExistanceInDBByEpisode(episode)))
        .then(episodes => Promise.all(episodes))
        .then(episodes_bool => episodes_bool.map((val, index) => {
            return {
                exists: val,
                episode: all_episodes[index]
            };
        }))
        .then(episodes => episodes.filter(episode => episode.exists))
        .then(episodes => episodes.map(episode => episode.episode))
        .then(episodes => all_episodes = episodes)//now we have only the episodes of popular serials
        .then(episodes => episodes.map(episode => episodeDBManager.checkForEpisodeExistanceInDB(episode)))
        .then(episodes => Promise.all(episodes))
        .then(episodes_bool => episodes_bool.map((val, index) => {
            return {
                exists: val,
                episode: all_episodes[index]
            }
        }))
        .then(episodes => episodes.filter(episode => !episode.exists)) //filter new episodes
        .then(episodes => episodes.map(episode => episode.episode))
        .then(episodes => episodes.filter(episode => episode.serial_orig_name))
        .then(episodes => episodes.map(episode => episodeDBManager.addNewEpisodeToDB(episode)))
        .then(episodes => Promise.all(episodes))
        .then(episodes => console.log(`[LF Parser]: ${episodes.length} new episodes added`))
    ;
};

exports.checkForNewEpisodes = function(){ // do not run on empty collection
    return new Promise((resolve, reject) => {
        let new_episodes = [];
        let runner = function(){
            let sequence = Promise.resolve();
            for (let i = 0; i < 120; i+=15){
                let episodes_on_page = [];
                sequence = sequence
                    .then(() => LFEpisodeParser.getAllEpisodesOnPage(episodes_on_page, i))
                    .then(episodes => episodes.map(episode => episodeDBManager.checkForEpisodeExistanceInDB(episode)))
                    .then(episodes => Promise.all(episodes))
                    .then(episodes_bool => episodes_bool.map((val, index) => {
                        return {
                            exists: val,
                            episode: episodes_on_page[index]
                        }
                    }))
                    .then(episodes_obj => episodes_obj.filter(episode => !episode.exists))
                    .then(episodes_obj => episodes_obj.map(episode => {
                        return episode.episode;
                    }))
                    .then(episodes => episodes.map(episode => LFEpisodeParser.addDownloadLinksToEpisode(episode)))
                    .then(episodes => Promise.all(episodes))
                    .then(episodes => episodes.map(episode => episodeDBManager.addNewEpisodeToDB(episode)))
                    .then(episodes => Promise.all(episodes))
                    .then(episodes => {
                        if (episodes.length === 0){ //no new episodes on page => no need to parse anymore
                            resolve(new_episodes);
                            return Promise.reject(new Error(''));
                        }
                        new_episodes = new_episodes.concat(episodes);
                    })
                    .catch((err) => Promise.reject((err)?err:null))

            }
            sequence = sequence
                .catch(err => {
                    if (err.message != '')
                        console.error(err.message)
                });
            return sequence = sequence.then(() => Promise.resolve(new_episodes));
        };
        return runner()
            .then(episodes => {
                console.log(`[LF Parser]: ${episodes.length} new episodes parsed and added to DB.`);
                episodes.forEach(episode => console.log(`\t${episode.serial_name} S${episode.season}E${(episode.episode_number)?episode.episode_number:0} (${moment(episode.release_date).format('DD/MM/YYYY HH:mm:ss Z')})`));
                return episodes;
            });
    })
};

//exports.checkForNewEpisodes();


