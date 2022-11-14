const { Router } = require('express')
const Lesson = require("../models/Lesson");

const router = Router()

router.get("/api/teachers/:division_id", async (req, res) => {
    const { division_id } = req.params;

    const lessons = await Lesson.find({
        "teacher.id_1c": division_id,
    }).lean();

    res.json(lessons);
})

module.exports = router