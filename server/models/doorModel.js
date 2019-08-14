const mongoose = require('mongoose')

const doorSchema = new mongoose.Schema({
    description: {type: String, unique: true},
    name: {type: Boolean, default: false},
    is_used: {type: Boolean, default: false},
    users: {type: Array, default: []},
    permissions: {type: Array, default: []}
})

module.exports = mongoose.model('Door', doorSchema)
