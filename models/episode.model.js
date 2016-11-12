var mongoose = require('mongoose');
if (!mongoose.connection.readyState){
    mongoose.connect('mongodb://localhost:27017/cw-serialoman');
}
var Schema = mongoose.Schema;
mongoose.Promise = Promise;

var episodeSchema = new Schema({
    serial_name: {
        type: String,
        required: true
    },
    serial_rus_name:{
        type:String,
        required:true
    },
    serial_orig_name:{
        type:String,
        required:true
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
        type: Date,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    full_season:{
        type: Boolean,
        default:false
    },
    download_page_url:{
        type:String,
        required:true
    },
    download_urls:{
        type: [
            {
                quality: String,
                link:String,
                size: String
            }
        ],
        required:true
    }
});

module.exports = mongoose.model('Episode',episodeSchema);
