const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Notice = new Schema({
    title: {
        type: String
    },
    text: {
        type: String
    },
    category: {
        type: String
    },
    author: {
        type: String
    },
    flagged: {
        is_flagged: {
            type: Boolean,
            default: false
        },
        info: {
            type: String
        },
        by: {
            type: String
        }
    }
});

module.exports = mongoose.model('Notice', Notice);