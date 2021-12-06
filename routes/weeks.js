const { Router } = require('express')
const { DateTime } = require('luxon')

const Week = require('../models/Week')

const today = DateTime.local()

const router = Router()

router.get('/api/weeks/', async (req, res) => {
    const weeks = await Week.find().lean()
    res.json(weeks)
})

router.get('/api/weeks/date/:date', async (req, res) => {    
    const startOfWeek = DateTime.fromISO(req.params.date)
        .setZone('Asia/Yekaterinburg')
        .startOf('week')
        .plus({hours: 5})
        .toISO()
    const weeks = await Week.find({dateStart: startOfWeek}).lean()
    res.json(weeks)
})

router.get('/api/weeks/year/:year', async (req, res) => {    
    const year = Number(req.params.year)    
    const startYear = DateTime.local(year, 8, 23)
        .setZone('Asia/Yekaterinburg')
        .plus({hours: 5})
        .toISO()
    const endYear = DateTime.local(year + 1, 6, 30)
        .setZone('Asia/Yekaterinburg')
        .plus({hours: 5})
        .toISO()

    const weeks = await Week.where('dateStart').gt(startYear).lt(endYear).lean()
    //.find({ dateStart: { $gte: startYear, $lte: endYear }})
    res.json(weeks)
})

module.exports = router
