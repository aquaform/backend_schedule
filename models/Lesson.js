const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: String,
    lessonNumber: Number,
    subgroup: Number,
    doc_id_1c: String,
    version: Number,    
    group: { 
        name: String,
        devisionId: String,
        course: Number,
        id_1c: String,
    },
    division: { 
        name: String,
        abb_name: String,
        id_1c: String
    },
    cabinet: { 
        name: String,
        number: String,
        id_1c: String
    },
    subject: { 
        name: String,
        abb_name: String,
        id_1c: String
    },
    teacher: { 
        name: String,
        abb_name: String,
        id_1c: String
    },
    week_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Week'
    },

})

module.exports = mongoose.model('Lesson', schema)
