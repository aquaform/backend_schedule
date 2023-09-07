const mongoose = require('mongoose')
const Odata1C = require('../Odata1C')
const Schedule = require('../Schedule')

const Group = require('../../schemes/Group')


const loadGroups = async () => {
    // удалить предыдущие записи
    await Group.deleteMany({});

    const odata = new Odata1C('https://college.sielom.ru/college', 'odata', 'Populizm123')
    const collegeSchedule = new Schedule(odata)

    const data1cGroups = await collegeSchedule.getGroups()

    data1cGroups.forEach((group1C) => {
        const group = new Group({
            _id: new mongoose.Types.ObjectId(),
            name: group1C.name,
            divisionId: group1C.divisionId,
            course: group1C.course,
            id_1c: group1C.id,
        })

        group.save()
    })
}

module.exports = loadGroups