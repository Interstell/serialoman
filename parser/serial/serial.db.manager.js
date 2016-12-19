const fs = require('fs');
const Serial = require('./../../models/serial.model.js');
const parser = require('../lostfilm/lostfilm.serial.parser');

exports.fillBaseFromJSON = function(){
    fs.readFile('./serials_example.json', (err, buf)=>{
        if (!err){
            let arr = JSON.parse(String(buf));
            arr.forEach((val) => {
                let entry = new Serial(val);
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

exports.checkForSerialExistanceInDB = function(serial){
    return new Promise ((resolve, reject)=>{
        Serial
            .findOne({$or: [{orig_name:serial.orig_name}, {rus_name:serial.rus_name}]})
            .exec((err, serial_db) => {
                if (err){
                    return reject(err);
                }
                if (serial_db){
                    if (serial_db.source != serial.source){
                        serial_db[`${serial.source}_url`] = serial.url;
                        serial_db.save();
                    }
                }
                (serial_db)?resolve(true):resolve(false);
            });
    });
};

function setTotalSerialsCount() {
    return new Promise((resolve, reject) => {
        if (TotalSerialsInDb)
            return resolve();
        Serial
            .count({})
            .exec((err, value) => {
                TotalSerialsInDb = value;
                resolve();
            });
    })
}

exports.addNewSerialToDB = function(new_serial){ //todo indeces not working
  return new Promise((resolve, reject) => {
      Serial
          .count({})
          .exec((err, value) => {
              value++;
              let serial = new Serial(new_serial);
              serial.serial_id = value;
              serial.save((err, data)=>{
                  if (err)
                      reject(err);
                  resolve(data);
              });
          });
  });
};

exports.normalizeIndeces = function () {
    let i = 1;
    Serial
        .find({})
        .exec((err, serials) => {
            serials.forEach(serial => {
                serial.serial_id = i++;
                serial.save();
            })
        });
};

exports.normalizeIndeces();

/*exports.addColors = function(new_serial){
    Serial
        .find({})
        .exec((err, serials) => {
           Promise.resolve(serials)
               .then(serials => serials.map(serial => parser.addColorToSerialByPoster(serial)))
               .then(serials => Promise.all(serials))
               .then(serials => serials.map(serial => {
                   serial.save((err, data) => {
                      console.log(data.poster_color);
                   });
               }))
        });
};*/