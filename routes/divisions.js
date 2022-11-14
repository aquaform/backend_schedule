const { Router } = require('express')

const Division = require("../models/Division");

const router = Router()

router.get('/api/divisions/', async (req, res) => {
    const groups = await Division.find().lean()

    res.json(groups)
})


module.exports = router