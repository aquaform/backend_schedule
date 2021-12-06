const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    division: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Division'
    },
    id_1c: String,
    name: String
})

module.exports = mongoose.model('Cabinet', schema)