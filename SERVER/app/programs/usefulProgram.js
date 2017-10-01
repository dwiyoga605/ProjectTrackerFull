var jwt = require('jsonwebtoken');

var usefulProgram = {}

usefulProgram.changeDateFormat = async (dateUTCString) => {
    var monthMap = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"}
    var splitDate = await dateUTCString.split(" ")
    return splitDate[3] + "-" + monthMap[splitDate[2]] + "-" + splitDate[1]
}

usefulProgram.changeDateFormatForExcel = async (dateUTCString) => {
    var unix = new Date(time_string)
    var date = new Date(unix.getTime())

    var yearString = date.getFullYear().toString()
    var month = parseInt(date.getMonth()) + 1

    if (month < 10) {
        var monthString = "0" + month.toString()
    } else {
        var monthString = month.toString()
    }

    var date = date.getDate()

    return date.getFullYear() + "-" + (parseInt(date.getMonth())+1).toString() + "-" + date.getDate()
}

usefulProgram.decodeToken = async (token) => {
    var decoded_token = await jwt.decode(token.split(" ")[1])
    return decoded_token
}

module.exports = usefulProgram