const Week = require('../../schemes/Week')

const loadWeek = ({week}) => {
    const newWeek = new Week({week})

    newWeek.save()
}

module.exports = loadWeek