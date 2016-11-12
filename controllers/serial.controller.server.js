const Serial = require ('../models/serial.model');

exports.getSerials = function(req, res){
    let briefly = (req.query.briefly)?req.query.briefly:false;
    let size = (req.query.size)? parseInt(req.query.size): 15;
    if (!briefly && (!size || size <= 0))
        size = 15;
    let offset = (req.query.offset)? parseInt(req.query.offset):0;
    let briefSelectString = '';
    if (briefly){
        briefSelectString = 'name rus_name orig_name source genres is_on_air';
        if (!req.query.size)
            size = 0;
    }
    if (!offset || offset < 0)
        offset = 0;
    Serial.find({})
        .limit(size)
        .skip(offset)
        .select(briefSelectString)
        .exec((err, data) => {
            if (err)
                res.status(500).json(err);
            res.json(data);
        });
};

exports.getSerialById = function(req, res){
    Serial
        .findOne({_id: req.params.serial_id})
        .exec((err, data) => {
            if (err)
                res.status(500).json(err);
            res.json(data);
        })
};