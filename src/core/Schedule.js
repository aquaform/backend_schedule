const { DateTime } = require('luxon')
const removeTimeZone = require('../utils/helpers/utils')

class Schedule {
    static abb_division(name) {
        return name.replace(/ .*/,'').replace('(','').replace(')','')
    }
	
    constructor(odataObject) {
		this.odata1c = odataObject
	}

	async getLessons(dateStart, dateEnd, type, id) {
		const param = {}
		param.dateStart = dateStart
		param.dateEnd = dateEnd
		param.filter = ''

		
		let result = []
		let currentDay = dateStart
		let lessonsForDay = [];
     
		while (removeTimeZone(DateTime.fromISO(currentDay).endOf('day').toISO()) !== dateEnd) {
			lessonsForDay = await this.getLessonsForData(currentDay, param.filter)
			result = [...result, ...lessonsForDay]
			currentDay = removeTimeZone(DateTime.fromISO(currentDay).plus({days: 1}).toISO())      
		}

		return result
	}

	async getLessonsForData(day, filter) {
		const lessons = await this.odata1c.getObjects('InformationRegister_РасписаниеНаДату_RecordType()',
			`
				ДатаРасписания eq datetime'${day}' 
				${filter ? filter : ""}
			`
		)

		const promises = lessons.map(async lesson => {
			const date = lesson['ДатаРасписания']				
			const subject = await this.getSubject(lesson['Дисциплина_Type'], lesson['Дисциплина'])
			const teacher = await this.getTeacher(lesson['Преподаватель_Key'])
			const group = await this.getGroup(lesson['УчебнаяГруппа_Key'])
			const cabinet = await this.getCabinet(lesson['Аудитория_Key'])
			const division = await this.getDivision(group.divisionId)
			const timeStartDt = DateTime.fromISO(lesson['ВремяНачала'])
			const timeEndDt =  DateTime.fromISO(lesson['ВремяОкончания'])
			const timeStart = timeStartDt.hour + ':' + timeStartDt.minute
			const timeEnd = timeEndDt.hour + ':' + timeEndDt.minute


			const res = {
				doc_id: lesson.Recorder_Key,
				date,
				lessonNumber: lesson['НомерПары'],
				subgroup: lesson['Подгруппа'],
				subject,
				teacher,
				group,
				cabinet,
				division,
				timeStart,
				timeEnd
			}
			return res
		})
		
		return Promise.all(promises)
	}

	async getDivisions() {
		const divisions  = await this.odata1c.getObjects('Catalog_Отделения')
		return divisions.map(el => (
			{ 
				id: el.Ref_Key, 
				name: el.Description,
				abb_name: Schedule.abb_division(el.Description)
			}
		)).filter(el => (el.abb_name.indexOf('чн') === -1) && el.abb_name !== 'Старые' && (el.abb_name.indexOf('ыть') === -1) && (el.abb_name.indexOf('Раб') === -1))
		//)).filter(el => (el.abb_name === '№3,'))
	}

	async getGroups() {
		const groupsOnDivision =  await this.odata1c.getObjects(`Catalog_УчебныеГруппы`, `Статус eq 'Учится'`)

		const promises = groupsOnDivision.map(async group => {

			const course =  await this.getGroupCourse(group.Ref_Key)
			return { 
				id: group.Ref_Key, 
				name: group.Description, 
				course,
				divisionId: group['Отделение_Key']
			}
		})

		return Promise.all(promises)
	}

	async getGroupCourse(groupId) {
		const courses = await this.odata1c.getObjects(`InformationRegister_КурсыУчебныхГрупп_RecordType()/SliceLast`, 
			`УчебнаяГруппа_Key eq guid'${groupId}'`)

		return courses[0] ? courses[0]['Курс'] : 0
	}

	async getSubject(subjectType, subjectId) {
		const subjects = await this.odata1c.getObjects(subjectType.split('.')[1], `Ref_Key eq guid'${subjectId}'`)
		
		const subject = subjects[0]

		return subject ? { 
			id: subject.Ref_Key, 
			name: subject['ПолноеНаименование'], 
			abb_name: subject['СокращенноеНаименование']
		} : ''	
	}

	async getTeacher(teacherId) {
		const teachers = await this.odata1c.getObjects(`Catalog_Сотрудники`, `Ref_Key eq guid'${teacherId}'`)		
		const teacher = teachers[0]
		return { 
			id: teacher.Ref_Key, 
			name: teacher.Description, 
			abb_name: teacher.Description.replace(/(.+) (.).+ (.).+/, '$1 $2.$3.')
		}
	}

	async getGroup(groupId) {
		const groups = await this.odata1c.getObjects(`Catalog_УчебныеГруппы`, `Ref_Key eq guid'${groupId}'`)
		const course = await this.getGroupCourse(groupId)

		const group = groups[0]
		return { 
			id: group.Ref_Key, 
			name: group.Description,
			course,
			divisionId: group['Отделение_Key']
		}			
	}

	async getCabinet(cabinetId) {
		const cabinets = await this.odata1c.getObjects(`Catalog_Аудитории`, `Ref_Key eq guid'${cabinetId}'`)
		const cabinet = cabinets[0]
		return cabinet ? { 
			id: cabinet.Ref_Key, 
			name: cabinet.Description,
			number: cabinet.Code
		} : ''
	}

	async getDivision(divisionId) {		
		const divisions = await this.odata1c.getObjects(`Catalog_Отделения`, `Ref_Key eq guid'${divisionId}'`)
		const division = divisions[0]	
		return { 
				id: division.Ref_Key, 
				name: division.Description,
				abb_name: Schedule.abb_division(division.Description)
		}			
	}

}


module.exports = Schedule

