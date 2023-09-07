const { Router } = require('express')

const Group = require("../schemes/Group");
const loadGroups = require("../core/scripts/loadGroups");

const router = Router()

router.get('/api/groups/', async (req, res) => {
    const groups = await Group.find().lean()

    res.json(groups)
})

router.get("/api/groups/load", async (req, res) => {
    loadGroups()

    res.json("groups loading in db. ..")
})


module.exports = router