const removeTimeZone = (date) => date.split('+')[0]
const addZero = (num) => Number(num) < 10 ? '0' + num : num


module.exports = { removeTimeZone, addZero }
