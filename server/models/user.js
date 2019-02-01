const mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    }
});

// var newUser = new User({
//     email: 'deno@gmail.com'
// }).save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save todo', e);
// });

module.exports = {
    User
};