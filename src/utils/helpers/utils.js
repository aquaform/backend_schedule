const removeTimeZone = (date) => date.split('+')[0]
const addZero = (num) => num < 10 ? '0' + num : num


module.exports = { removeTimeZone, addZero }
