const Episode = require('../models/episode.model');
const Serial = require('../models/serial.model');

exports.getEpisodes = function(req, res){
    let size = (req.query.size)? parseInt(req.query.size): 30;
    if (!size || size <= 0 || size > 30)
        size = 30;
    let offset = (req.query.offset)? parseInt(req.query.offset):0;
    if (!offset || offset < 0)
        offset = 0;
    let since = (req.query.since)?req.query.since:'';
    let before = (req.query.before)?req.query.before:'';
    let serial_name = (req.query.serial_name)?req.query.serial_name:null;
    let season_num = (req.query.season)?parseInt(req.query.season):null;
    let episode_num = (req.query.episode)?parseInt(req.query.episode):null;
    let briefly = (req.query.briefly)?req.query.briefly:false;
    let briefSelectString = '';
    if (briefly && briefly != 'false'){
        briefSelectString = '_id serial_orig_name season episode_number source';
        if (!req.query.size && req.query.serial_name)
            size = 0;
    }
    let query = Episode.find({})
        .select(briefSelectString)
        .limit(size)
        .skip(offset)
        .sort({release_date: -1});
    if (req.query.since || req.query.before){
        query = query.where('release_date');
    }
    if (req.query.since){
        query = query.gte(since);
    }
    if (req.query.before){
        query = query.lte(before);
    }
    if (req.query.serial_name){
        query = query.find({serial_orig_name: new RegExp(serial_name,'i')});
    }
    if (req.query.season){
        query = query.find({season: season_num});
    }
    if (req.query.episode){
        query = query.find({episode_number: episode_num})
    }
    query
        .exec((err, data) => {
            if (err)
                res.status(500).json(err);
            res.json(data);
        });
};

exports.getEpisodesStrictly = function(req, res){
    let serial_id = parseInt(req.params.serial_id);
    let season_num = parseInt(req.params.season);
    let episode_num = parseInt(req.params.episode);
    Serial
        .findOne({serial_id: serial_id})
        .exec((err, serial) => {
            if (!err){
                Episode
                    .find({serial_orig_name: new RegExp(serial.orig_name,'i')})
                    .find({season: season_num})
                    .find({episode_number: episode_num})
                    .exec((err, data) => {
                        if(!err){
                            res.json(data);
                        }
                        else res.status(500).json(err);
                    })
            }
            else res.status(500).json(err);
        });
};

exports.getEpisodeById = function(req, res){
    Episode
        .findOne({_id: req.params.episode_id})
        .exec((err, data) => {
            if (err)
                res.status(500).json(err);
            res.json(data);
        })
};