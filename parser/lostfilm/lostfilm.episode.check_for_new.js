const LFEpisodeParser = require('./lostfilm.episode.parser');
const episodeDBManager = require('../episode/episode.db.manager');

exports.parseAllEpisodes = function(){ //dev function for initialize parsing
    let all_episodes;
    LFEpisodeParser.getAllEpisodes(0, 75)
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
            for (let i = 0; i < 1000; i+=15){
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
                        console.log(err.message)
                });
            return sequence;
        };
        runner()
            .then(() => resolve(new_episodes));
    })
};

/*exports.checkForNewEpisodes()
    .then(episodes => {
        console.log(`[LF Parser]: ${episodes.length} new episodes parsed.`);
        episodes.forEach(episode => console.log(`\t${episode.serial_name} S${episode.season}E${episode.episode_number} (${episode.release_date})`));
    });*/


exports.parseAllEpisodes();