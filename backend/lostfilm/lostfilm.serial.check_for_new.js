const LFparser = require('./lostfilm.parser.js');
const serialDBManager = require('./../serial/serial.db.manager.js');

exports.checkForNewSerials = function () {
    LFparser
        .getPopularSerialsList()
        .then(arr => {
            return new Promise((resolve, reject)=>{
                Promise.resolve(arr.map((serial)=>{
                    return serialDBManager.checkForSerialExistanceInDB(serial);
                }))
                    .then(serials_bool => Promise.all(serials_bool))
                    .then(serials_bool => serials_bool.map((val, index) => {
                        return {
                            exists: val,
                            serial: arr[index]
                        }
                    }))
                    .then(serials => serials.filter(val => !val.exists))
                    .then(serials => serials.map(val =>{
                        return val.serial;
                    }))
                    .then(serials => resolve(serials))
                    .catch(err => console.log(err.message));
            });
        })
        .then(serials => serials.map(val => LFparser.getSerialDetailedInfo(val)))
        .then(serials => Promise.all(serials))
        .then(serials => serials.map(val => serialDBManager.addNewSerialToDB(val)))
        .then(serials => Promise.all(serials))
        .then(serials => console.log(`[LF Parser]: ${serials.length} new serials added`))
        .catch(err => console.log(err.message));
};

exports.checkForNewSerials();