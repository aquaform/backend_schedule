const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    divisionId: String,
    id_1c: String,
    course: String,
    name: String
})

module.exports = mongoose.model('Group', schema)