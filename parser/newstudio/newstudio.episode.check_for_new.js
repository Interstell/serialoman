const Episode = require('../../models/episode.model');
const Serial = require('../../models/serial.model');

function getAllSerialsFromDb() {
    return new Promise((resolve, reject)=>{
        Serial
            .find({source: 'newstudio'})
            .exec((err, data) => {
                if (err)
                    reject(err);
                else resolve(data);
            })
    })
}

exports.parseAllEpisodesAndAddToDb = function () {
    getAllSerialsFromDb();
};