const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    divisionId: String,
    date: String,
    lessonNumber: String,
    timeStart: String,
    timeEnd: String
})

module.exports = mongoose.model('LessonsTime', schema)