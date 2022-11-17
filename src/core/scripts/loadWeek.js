const Week = require('../../schemes/Week')

const loadWeek = async (week) => {
    const newWeek = await Week.create(week)

    newWeek.save()
}

module.exports = loadWeek