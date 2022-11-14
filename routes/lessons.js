const { Router } = require("express");
const { DateTime } = require("luxon");

const Lesson = require("../models/Lesson");
const Week = require("../models/Week");
const loadLessons = require("../loadLessons");

const router = Router();

router.get("/api/lessons/date/:date", async (req, res) => {
  const startOfWeek = DateTime.fromISO(req.params.date)
    .setZone("Asia/Yekaterinburg")
    .startOf("week")
    .plus({ hours: 5 })
    .toISO();
  const week = await Week.findOne({ dateStart: startOfWeek }).lean();
  const lessons = await Lesson.find({
    date: req.params.date,
    version: week.version,
  }).lean();
  res.json(lessons);
});

router.get("/api/lessons/week/:week_id/", async (req, res) => {
  const week = await Week.findOne({ _id: req.params.week_id });
  const lessons = await Lesson.find({
    week_id: week._id,
    version: week.version,
  }).lean();

  res.json(lessons);
});

router.get("/api/lessons/group/:group_id", async (req, res) => {
  const { week_id } = req.query;
  const {group_id} = req.params;

  if (!week_id || !group_id ) {
    return res.json({
      error: "не заданы параметры week_id и group_id",
    });
  }

  const week = await Week.findOne({ _id: week_id });
  const lessons = await Lesson.find({
    week_id: week._id,
    version: week.version,
    "group.id_1c": group_id,
  }).lean();

  res.json(lessons);
});

router.get("/api/lessons/division", async (req, res) => {
  const { week_id, divisionName } = req.query;

  if (!week_id || !divisionName ) {
    return res.json({
      error: "не заданы параметры week_id и divisionName",
    });
  }

  const week = await Week.findOne({ _id: week_id });
  const lessons = await Lesson.find({
    week_id: week._id,
    version: week.version,
    "division.name": divisionName,
  }).lean();

  res.json(lessons);
});

router.get("/api/lessons/teacher", async (req, res) => {
  const { week_id, teacherName } = req.query;

  if (!week_id || !teacherName ) {
    return res.json({
      error: "не заданы параметры week_id и teacherName",
    });
  }

  const week = await Week.findOne({ _id: week_id });
  const lessons = await Lesson.find({
    week_id: week._id,
    version: week.version,
    "teacher.abb_name": teacherName,
  }).lean();

  res.json(lessons);
});

router.get("/api/lessons/load", async (req, res) => {
  loadLessons(false);
  //loadLessons(true)

  res.json("ok");
});

module.exports = router;
