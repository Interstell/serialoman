const mongoose = require('mongoose');
if (!mongoose.connection.readyState){
    mongoose.connect('mongodb://localhost:27017/cw-serialoman');
}
let Schema = mongoose.Schema;
mongoose.Promise = Promise;

let subscriptionSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        required: true
    },
    serial_orig_name: {
        type: String,
        required: true
    },
    notification_methods:{
        type: [String], //email, browser
        default: [],
    },
    episode_sources: {
        type: [String],
        default: [],
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
