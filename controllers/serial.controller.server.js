const Serial = require ('../models/serial.model');

exports.getSerials = function(req, res){ //todo never return full episodes array, return full episode only alone
    let briefly = (req.query.briefly)?req.query.briefly:false;
    let size = (req.query.size)? parseInt(req.query.size): 15;
    if (!briefly && (!size || size <= 0))
        size = 15;
    let offset = (req.query.offset)? parseInt(req.query.offset):0;
    let briefSelectString = '';
    if (briefly && briefly != 'false'){
        briefSelectString = '_id serial_id name rus_name orig_name start_year is_on_air poster actors poster_color';
        if (!req.query.size)
            size = 0;
    }
    if (!offset || offset < 0)
        offset = 0;
    let sort = (req.query.sort)?parseInt(req.query.sort): 1;
    let mongooseQuery = Serial.find({});
    if (req.query.is_on_air){
        if (req.query.is_on_air == 'true')
            mongooseQuery = mongooseQuery.find({is_on_air: true});
        else if (req.query.is_on_air == 'false')
            mongooseQuery = mongooseQuery.find({is_on_air: false});
    }
    mongooseQuery
        .limit(size)
        .skip(offset)
        .sort({rus_name: sort})
        .select(briefSelectString)
        .exec((err, data) => {
            if (err)
                res.status(500).json(err);
            res.json(data);
        });
};

exports.getSerialById = function(req, res){
    Serial
        .findOne({_id: req.params._id})
        .exec((err, data) => {
            if (err)
                res.status(500).json(err);
            res.json(data);
        })
};

exports.getSerialBySerialId = function (req, res) {
    Serial
        .findOne({serial_id: req.params.serial_id})
        .exec((err, data) => {
            if (err)
                res.status(500).json(err);
            res.json(data);
        })
};

exports.getSerialByOriginalName = function (req, res) {
    Serial
        .findOne({orig_name: new RegExp('^'+req.params.serial_name+'$','i')})
        .exec((err, data) => {
            if (err)
                return res.status(500).json(err);
            if (!data)
                return res.json({});
            res.json(data);
        })
};