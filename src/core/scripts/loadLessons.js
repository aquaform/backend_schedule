const mongoose = require('mongoose')
const { DateTime, Interval } = require('luxon')

const Odata1C = require('../Odata1C')
const Schedule = require('../Schedule')

const Week = require('../../schemes/Week')
const Lesson = require('../../schemes/Lesson')
const loadWeek = require('./loadWeek')

const removeTimeZone = require('../../utils/helpers/utils')

const loadLessons = async (next = false) => {
	await mongoose.connect('mongodb://localhost:27017/schedule', {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})

	const odata = new Odata1C('https://college.sielom.ru/college', 'odata', 'Populizm123')
	const collegeSchedule = new Schedule(odata)

	const today = next
		? DateTime.local().plus({ weeks: 1}).setZone('Asia/Yekaterinburg')
		: DateTime.local().setZone('Asia/Yekaterinburg')

	const startOfWeek = today.startOf('week')
	const endOfWeek =  today.endOf('week')

	const dayStart = removeTimeZone(startOfWeek.toISO())

	// const data1cLessons = await collegeSchedule.getLessons(removeTimeZone(startOfWeek.toISO()), removeTimeZone(endOfWeek.toISO()), 'all')
	// data1cLessons.forEach(loadLesson)

	const getLessonsForDay = async (day) => {
		return  await collegeSchedule.getLessonsForData(day)
	}

	const loadWeekLessons = async () => {
		const weekDays = [0, 1, 2, 3, 4, 5].map((numDay) => {
			return removeTimeZone(DateTime.fromISO(dayStart).plus({days: numDay}).toISO())
		})

		const {weekVersion, weekId} = await getCurrentWeek()
		let daysCount  = 0

		for (const day of weekDays) {
			const lessonsDay = await getLessonsForDay(day)
			if (lessonsDay.length !== 0) {
				lessonsDay.forEach(lesson => loadLesson(lesson, weekVersion, weekId))
				daysCount++;
			}
		}

		if (daysCount === 0) {
			console.log("Lessons not find")
			return;
		}

		await Lesson.deleteMany({ version: { $lte: +weekVersion - 1 }, week_id: weekId });

		console.log('All lessons loaded!')
	}

	const getCurrentWeek = async () => {
		const currentWeek = await Week.findOne({ dateStart: startOfWeek.plus({hours: 5}) }).exec()
		const weekVersion = currentWeek ? currentWeek.version + 1 : 1
		const weekId =  currentWeek ? currentWeek._id : new mongoose.Types.ObjectId()

		if (currentWeek) {
			await currentWeek.updateOne({ version: weekVersion })
		} else {
			const semester = startOfWeek.month < 8 ? 2 : 1
			const year = semester === 1 ? startOfWeek.year : startOfWeek.year - 1
			const countOfWeek = Math.ceil(
				Interval.fromDateTimes(DateTime.local(year, 9, 1),
					endOfWeek.plus({hours: 5})).length('weeks')
			)

			await loadWeek({
				_id: weekId,
				dateStart: startOfWeek.plus({hours: 5}).toISO(),
				dateEnd: endOfWeek.plus({hours: 5}).toISO(),
				semester,
				count: countOfWeek,
				version: weekVersion
			})
		}

		return {weekVersion, weekId}
	}

	const loadLesson = (lesson1C, weekVersion, weekId) => {
		const lesson = new Lesson({
			_id: new mongoose.Types.ObjectId(),
			date: DateTime.fromISO(lesson1C.date, {zone: 'Asia/Yekaterinburg'})
				.plus({hours: 5}).toISO().split('T')[0],
			lessonNumber: lesson1C.lessonNumber,
			timeStart: lesson1C.timeStart,
			timeEnd: lesson1C.timeEnd,
			subgroup: lesson1C.subgroup,
			group: {
				name: lesson1C.group.name,
				devisionId: lesson1C.group.devisionId,
				course: lesson1C.group.course,
				id_1c: lesson1C.group.id,
			},

			subject: {
				name: lesson1C.subject.name,
				abb_name: lesson1C.subject.abb_name,
				id_1c: lesson1C.subject.id,
			},

			teacher: {
				name: lesson1C.teacher.name,
				abb_name: lesson1C.teacher.abb_name,
				id_1c: lesson1C.teacher.id,
			},

			cabinet: {
				name: lesson1C.cabinet.name,
				number: lesson1C.cabinet.number,
				id_1c: lesson1C.cabinet.id,
			},

			division: {
				name: lesson1C.division.name,
				abb_name: lesson1C.division.abb_name,
				id_1c: lesson1C.division.id,
			},
			doc_id_1c: lesson1C.doc_id,
			version: weekVersion,
			week_id: weekId
		})

		lesson.save()
	}

	await loadWeekLessons()
}

module.exports = loadLessons
