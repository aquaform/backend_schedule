const mongoose = require('mongoose')

const Odata1C = require('../Odata1C')
const Schedule = require('../Schedule')

const Division = require('../../schemes/Division')


const loadDivisions = async () => {
    const odata = new Odata1C('https://college.sielom.ru/college', 'odata', 'Populizm123')
    const collegeSchedule = new Schedule(odata)

    const data1cDivisions = await collegeSchedule.getDivisions()

    data1cDivisions.forEach((division1C) => {
        const division = new Division({
            _id: new mongoose.Types.ObjectId(),
            name: division1C.name,
            abb_name: division1C.abb_name,
            id_1c: division1C.id
        })

        division.save()
    })
}

module.exports = loadDivisions