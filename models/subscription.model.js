const mongoose = require('mongoose');
if (!mongoose.connection.readyState){
    mongoose.connect('mongodb://localhost:27017/cw-serialoman');
}
let Schema = mongoose.Schema;
mongoose.Promise = Promise;

let subscriptionSchema = new Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    serial_orig_name: {
        type: String,
        required: true
    },
    episode_source: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
