const Odata1C = require('./core/Odata1C')
const Schedule = require('./core/Schedule')

const odata = new Odata1C('http://5.141.9.194/college/', 'odata', 'Populizm123')
const collegeSchedule = new Schedule(odata)

collegeSchedule.getDivisions()
    .then(res => {
        console.log(res)
    })