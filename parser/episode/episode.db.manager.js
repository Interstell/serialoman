const fs = require('fs');
const Episode = require('./episode.model');
const serialDBManager = require('../serial/serial.db.manager');

exports.fillBaseFromJSON = function(){
    fs.readFile('./episodes_example.json', (err, buf)=>{
        if (!err){
            let arr = JSON.parse(String(buf));
            arr.forEach((val) => {
                let entry = new Episode(val);
                entry.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            })
        }
        else console.log(err);
    });
};

exports.checkForEpisodeExistanceInDB = function(episode){
    return new Promise ((resolve, reject)=>{
        Episode
            .findOne()
            .or([{serial_rus_name: new RegExp('^'+episode.serial_rus_name+'$','i')},
                {serial_orig_name: new RegExp('^'+episode.serial_orig_name+'$','i')}])
            .and([{season: episode.season},
                {episode_number: (episode.full_season)?0:episode.episode_number},
                {source: episode.source}])
            .exec((err, episode) => {
                if (err){
                    return reject(err);
                }
                (episode)?resolve(true):resolve(false);
            });
    });
};

exports.addNewEpisodeToDB = function(new_episode){
    return new Promise((resolve, reject) => {
        let episode = new Episode(new_episode);
        episode.save((err, ep)=>{
            if (err){
                console.log(new_episode);
                return reject(err);
            }
            resolve(ep);
        });
    });
};

exports.checkForSerialExistanceInDBByEpisode = function (episode) {
    let search_object = {
        orig_name : episode.serial_orig_name,
        rus_name : episode.serial_rus_name
    };
    return serialDBManager.checkForSerialExistanceInDB(search_object);
};

/*exports.checkForEpisodeExistanceInDB({
    serial_rus_name: 'Салем',
    season: 3,
    episode_number: 1,
    source:'lostfilm'
})
    .then(answer => console.log(answer));*/

/*exports.checkForEpisodeExistanceInDB({
    serial_rus_name: 'Красавица и чудовище',
    season: 4,
    full_season:true,
    source:'lostfilm'
})
    .then(answer => console.log(answer));*/

//exports.fillBaseFromJSON();