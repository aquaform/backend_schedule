const Odata1C = require('./core/Odata1C')
const Schedule = require('./core/Schedule')

const odata = new Odata1C('https://college.sielom.ru/college/', 'odata', 'Populizm123')
const collegeSchedule = new Schedule(odata)

collegeSchedule.getDivisions()
    .then(res => {
        console.log(res)
    })