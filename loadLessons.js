const mongoose = require('mongoose')
const { DateTime, Interval } = require('luxon')

const Odata1C = require('./core/Odata1C')
const Schedule = require('./core/Schedule')

const Week = require('./models/Week')
const Lesson = require('./models/Lesson')

const removeTimeZone = require('./core/utils')


const start = async (next = false) => {
	const odata = new Odata1C('https://college.sielom.ru/college', 'odata', 'Populizm123')
	const collegeSchedule = new Schedule(odata)

	const today = next ? DateTime.local().plus({ weeks: 1}).setZone('Asia/Yekaterinburg') : DateTime.local().setZone('Asia/Yekaterinburg') 
	const startOfWeek = today.startOf('week')
	const endOfWeek =  today.endOf('week')

	const db = await mongoose.connect('mongodb://localhost:27017/schedule', {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true }
	)
  
	const data1c = await collegeSchedule.getLessons(removeTimeZone(startOfWeek.toISO()), removeTimeZone(endOfWeek.toISO()), 'all')

	const currentWeek = await Week.findOne({ dateStart: startOfWeek.plus({hours: 5}) }).exec()
	const newVersion = currentWeek ? currentWeek.version + 1 : 1
	const weekId =  currentWeek ? currentWeek._id : new mongoose.Types.ObjectId()
	
	if (currentWeek) {		
		await currentWeek.updateOne({ version: newVersion})
	} else {
	
		const semester = startOfWeek.month < 8	? 2 : 1
		const year = semester === 1 ? startOfWeek.year : startOfWeek.year - 1
		const countOfWeek = Math.ceil(Interval.fromDateTimes(DateTime.local(year, 9, 1), endOfWeek.plus({hours: 5})).length('weeks'))
		
		await Week.create({		
			_id: weekId,	  
			dateStart: startOfWeek.plus({hours: 5}).toISO(), 
			dateEnd: endOfWeek.plus({hours: 5}).toISO(),
			semester,
			count: countOfWeek,
			version: newVersion })
	}
	
	data1c.forEach((lesson1C) => {
		const lesson = new Lesson({
			_id: new mongoose.Types.ObjectId(),
			date: DateTime.fromISO(lesson1C.date, {zone: 'Asia/Yekaterinburg'}).plus({hours: 5}).toISO().split('T')[0],
			lessonNumber: lesson1C.lessonNumber,
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
			version: newVersion,
			week_id: weekId
		})

		lesson.save()
	})

	console.log('The end')
}

module.exports = start
