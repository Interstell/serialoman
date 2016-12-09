const mongoose = require('mongoose');
if (!mongoose.connection.readyState){
    mongoose.connect('mongodb://localhost:27017/cw-serialoman');
}
let Schema = mongoose.Schema;
mongoose.Promise = Promise;

let userSchema = new Schema({
    username:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    real_name:{
        type: String
    },
    avatar: {
        type:String
    }
});

userSchema
    .set('toJSON', { transform: (doc, ret, options) => { delete ret.password; return ret; }});


module.exports = mongoose.model('User',userSchema);
