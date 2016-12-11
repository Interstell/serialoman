const NSSerialParser = require('./newstudio.serial.parser');
const SerialDbManager = require('../serial/serial.db.manager');
const fs = require('fs');

exports.checkForNewSerials = function () {
    let all_serials;
    NSSerialParser.parseSerialNamesFromIndexPage()
        .then(serials => NSSerialParser.getSerialsOriginalNames(serials))
        .then(serials => serials.filter(serial => serial.orig_name && serial.start_year && serial.genres && serial.active_translation))
        .then(serials => {
            all_serials = serials;
            return serials;
        })
        .then(serials => serials.map(serial => SerialDbManager.checkForSerialExistanceInDB(serial)))
        .then(serials => Promise.all(serials))
        .then(serials_bool => serials_bool.map((val, index) => {
            return {
                exists: val,
                serial: all_serials[index]
            }
        }))
        .then(serials => serials.filter(serial => !serial.exists))
        .then(serials => serials.map(serial => serial.serial))
        .then(serials => NSSerialParser.getOMDBData(serials))
        .then(serials => NSSerialParser.filterOMDBData(serials))
        .then(serials => serials.map(serial => NSSerialParser.fillObjectToSuitModel(serial)))
        .then(serials => Promise.all(serials))
        .then(serials => serials.map(serial => SerialDbManager.addNewSerialToDB(serial)))
        .then(serials => Promise.all(serials))
        .then(serials => console.log(`[NSParser]: ${serials.length} new serials added.`));
};

exports.checkForNewSerials();