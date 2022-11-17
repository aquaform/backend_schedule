const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dateStart: Date,
    dateEnd: Date,
    semester: Number,
    count: Number,
    version: Number    
})

module.exports = mongoose.model('Week', schema)