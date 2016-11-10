const LFEpisodeParser = require('./lostfilm.episode.parser');
const episodeDBManager = require('../episode/episode.db.manager');

exports.parseAllEpisodes = function(){ //dev function for initialize parsing
    let all_episodes;
    LFEpisodeParser.getAllEpisodes(3000, 3250)
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

exports.parseAllEpisodes();