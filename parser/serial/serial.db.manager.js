const fs = require('fs');
const Serial = require('./../../models/serial.model.js');

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
      let serial = new Serial(new_serial);
      serial.save((err)=>{
         if (err)
             reject(err);
          resolve(true);
      });
  });
};