const { Router } = require('express')

const Division = require("../schemes/Division");

const router = Router()
const loadDivisions = require("../core/scripts/loadDivisions")

router.get('/api/divisions/', async (req, res) => {
    const groups = await Division.find().lean()

    res.json(groups)
})

router.get("/api/divisions/load", async (req, res) => {
    loadDivisions()

    res.json("divisions loading in db...")
})


module.exports = router