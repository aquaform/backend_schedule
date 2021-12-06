const { Router } = require('express')
const { DateTime } = require('luxon')

const Lesson = require('../models/Lesson')
const Week = require('../models/Week')
const loadLessons = require('../loadLessons')

const router = Router()

router.get('/api/lessons/date/:date', async (req, res) => {   
    const startOfWeek = DateTime.fromISO(req.params.date)
        .setZone('Asia/Yekaterinburg')
        .startOf('week')
        .plus({hours: 5})
        .toISO()
    const week = await Week.findOne({dateStart: startOfWeek}).lean()
    const lessons = await Lesson.find({ date: req.params.date, version: week.version }).lean()    
    res.json(lessons)
})


router.get('/api/lessons/week/:week_id', async (req, res) => {  
    const week = await Week.findOne({_id: req.params.week_id}) 

    const lessons = await Lesson.find({ week_id: week._id, version: week.version }).lean()    
    res.json(lessons)
})

router.get('/api/lessons/load', async (req, res) => {  
    loadLessons(false)
    loadLessons(true)
       
    res.json('ok')
})

module.exports = router
