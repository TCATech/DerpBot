const mongoose = require('mongoose')

module.exports = mongoose.model('prefixes', new mongoose.Schema({
    Prefix: String,
    Guild: String
}))