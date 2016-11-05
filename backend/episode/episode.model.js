var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cw-serialoman');
var Schema = mongoose.Schema;
mongoose.Promise = Promise;

var episodeSchema = new Schema({
    serial_name: {
        type: String,
        required: true
    },
    serial_rus_name:{
        type:String
    },
    serial_orig_name:{
        type:String
    },
    episode_name:{
        type:String,
        required:true
    },
    episode_url:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        required: true
    },
    season:{
        type:Number,
        required:true,
    },
    episode_number:{
        type:Number,
        default: 0,
    },
    release_date:{
        type:String,
        required:true
    },
    lostfilm:{
        type:Boolean
    },
    full_season:{
        type: Boolean,
        default:false
    }
});

module.exports = mongoose.model('Episode',episodeSchema);
