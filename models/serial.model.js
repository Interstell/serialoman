const mongoose = require('mongoose');
if (!mongoose.connection.readyState){
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cw-serialoman');
}
let Schema = mongoose.Schema;
mongoose.Promise = Promise;

let serialSchema = new Schema({
   name: {
       type: String,
       required: true
   },
    rus_name:{
        type:String,
        required:true
    },
    orig_name:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    poster:{
        type:String,
        required:true
    },
    poster_color:{
        type:String
    },
    prod_country:{
        type:String
    },
    start_year:{
        type:Number,
        required:true
    },
    genres:{
        type:[String],
        required:true
    },
    seasons_num:{
        type:Number,
        required:true
    },
    is_on_air: {
        type:Boolean,
        required:true
    },
    own_site:{
        type:String
    },
    description:{
        type:String
    },
    actors:{
        type:String
    },
    directors:{
        type:String
    },
    scriptwriters:{
        type:String
    },
    plot:{
        type:String
    },
    serial_id:{
        type: Number,
        required: true
    },
    newstudio_url:{
       type: String
    },
    lostfilm_url:{
       type: String
    }
});

let serialModel = mongoose.model('Serial',serialSchema);
module.exports = serialModel;
