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
            .exec((err, serial) => {
                if (err){
                    return reject(err);
                }
                (serial)?resolve(true):resolve(false);
            });
    });
};

exports.addNewSerialToDB = function(new_serial){
  return new Promise((resolve, reject) => {
      Serial
          .count({})
          .exec((err, value) => {
              value++;
              let serial = new Serial(new_serial);
              serial.serial_id = value;
              serial.save((err)=>{
                  if (err)
                      reject(err);
                  resolve(true);
              });
          });
  });
};

exports.addColors = function(new_serial){
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
};