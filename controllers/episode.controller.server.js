const Episode = require('../models/episode.model');

exports.getEpisodes = function(req, res){
    let size = (req.query.size)? parseInt(req.query.size): 15;
    if (!size || size <= 0)
        size = 15;
    let offset = (req.query.offset)? parseInt(req.query.offset):0;
    if (!offset || offset < 0)
        offset = 0;
    Episode.find({})
        .limit(size)
        .skip(offset)
        .sort({release_date: -1})
        .exec((err, data) => {
            if (err)
                res.status(500).json(err);
            res.json(data);
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