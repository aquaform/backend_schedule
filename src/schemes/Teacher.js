const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    abb_name: String,
    id_1c: String,
    name: String,
    divisionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division'
    },
})

module.exports = mongoose.model('Teacher', schema)