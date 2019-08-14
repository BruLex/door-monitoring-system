const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    uid: { type: String, unique: true},
    is_system: {type: Boolean,  default: false},
    is_used: {type: Boolean,  default: false}
})

module.exports = mongoose.model('Card', cardSchema)
