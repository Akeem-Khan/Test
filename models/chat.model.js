const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Chat = new Schema({
    users: {
        type: Array,
        required: true
    },
    messages: {
        type: Array,
    },
});

module.exports = mongoose.model('Chat', Chat);