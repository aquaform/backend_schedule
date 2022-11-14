const { Router } = require('express')

const Group = require("../models/Group");

const router = Router()

router.get('/api/groups/', async (req, res) => {
    const groups = await Group.find().lean()

    res.json(groups)
})


module.exports = router