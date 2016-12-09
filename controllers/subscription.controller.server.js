const Subscription = require('../models/subscription.model');
const Serial = require('../models/serial.model');

exports.getSubscriptions = function(req, res){
    Subscription
        .find({user_id: req.user._id})
        .exec((err, data)=>{
            if (!err)
                res.json(data);
            else res.status(500).json(err);
        })
};

exports.addSubscription = function (req, res) {
    Subscription
        .findOne({$and: [{serial_orig_name:req.body.serial_orig_name}, {user_id:req.user._id}]})
        .exec((err, data) =>{
            if(err){
                res.status(500).json(err);
            }
            else if (data){
                res.status(422).json({error: 'Subscription already exists'});
            }
            else{
                Serial
                    .findOne({orig_name: new RegExp(`^${req.body.serial_orig_name}$`,'i')})
                    .exec((err, data) => {
                        if (err){
                            res.status(500).json(err);
                        }
                        else if (!data){
                            res.status(404).json({error: 'Serial with this name does not exist.'})
                        }
                        else{
                            let sub = new Subscription(req.body);
                            sub.user_id = req.user._id;
                            sub
                                .save((err, data) => {
                                    if (!err)
                                        res.json(data);
                                    else res.status(500).json(err);
                                });
                        }
                    });
            }
        });
};

exports.editSubscription = function(req, res){
    Subscription
        .findById(req.body._id)
        .exec((err, sub) => {
            if (err){
                res.status(500).json(err);
            }
            else if (!sub){
                res.status(404).json({error: 'No subscription with this id.'});
            }
            else{
                for (let key in req.body){
                    sub[key] = req.body[key];
                }
                sub.user_id = req.user._id;
                sub
                    .save((err, data) => {
                        if (err){
                            res.status(500).json(err);
                        }
                        else res.json(data);
                    })
            }
        });
};
