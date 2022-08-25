const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Appointment = new Schema({
    title: {type: String},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    startDate: {type: Date},
    endDate: {type: Date},
    rRule: {type: String},
    exDate: {type: Date},
    allDay: {type: Boolean},
    location: {type: String},
    notes: {type: String},
})

module.exports = mongoose.model('Appointment', Appointment)