'use strict';

var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database'),
    CustomDate = require('../models/custom_date');
var UsefulProgram = require('../programs/usefulProgram');
    // HolidayCalendar = require('../models/holiday_calendar');

// var changeDateFormat = async (dateString) => {
//     var monthMap = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"}
//     var splitDate = await dateString.split(" ")
//     return splitDate[3] + "-" + monthMap[splitDate[2]] + "-" + splitDate[1]
// }

var calendarController = {}

//api/customdate/add
calendarController.addDateCustom = async (req, res) => {
    console.log(0)
    console.log(req.body.custom_start_date, req.body.custom_end_date, req.body.custom_status)
    if (typeof req.body.custom_start_date === 'undefined' || typeof req.body.custom_end_date === 'undefined' || typeof req.body.custom_status === 'undefined') {
        console.log(1, "Err")
        return res.status(400).json({status: false, message: "Data Incomplete!"})
    } else {
        console.log(1)
        var dateNote = await ((typeof req.body.custom_note === 'undefined') ? "" : req.body.custom_note)
        try {
            console.log(2)
            await CustomDate.sync({hooks: true})
        } catch(e) {
            console.log(2, "Err")
            return res.status(500).json({status: false, message: "Internal Server Error (Sync)"})
        }

        console.log(3)
        var customStartDate = await Date.parse(req.body.custom_start_date)
        var customEndDate = await Date.parse(req.body.custom_end_date)
        
        if (customStartDate > customEndDate) {
            return res.status(400).json({status: false, message: "Invalid Date!"})
        }
        console.log(4)
        var diffDate = await ((customEndDate-customStartDate)/86400000)
        console.log("diffDate", diffDate)
        
        var bulkDate = {}
        for (var i=0; i<=diffDate; i++) {
            console.log(5)
            var dateDiff = await new Date(customStartDate + i * 86400000)
            var dateStatus = await req.body.custom_status 
            var successSum = 0
            // await console.log(dateDiff.getDay())

            // await console.log(dateDiff.getDay(), dateStatus)
            
            if (((dateDiff.getDay() != 0 && dateDiff.getDay() != 6) && !dateStatus) || ((dateDiff.getDay() === 0 || dateDiff.getDay() === 6) && dateStatus)) {
                console.log(6)
                var dateToInput = await UsefulProgram.changeDateFormat(dateDiff.toUTCString())
                // var dateToInput = await dateDiff.getFullYear() + "-0" + dateDiff.getMonth() + "-0" + dateDiff.getDate()
                // console.log(dateToInput, dateDiff)

                try {
                    // console.log(7)
                    var inputToDB = await CustomDate.create({
                        custom_date_date: dateToInput,
                        custom_date_note: dateNote,
                        custom_date_status: req.body.custom_status
                    })

                    if (inputToDB != null) {
                        successSum = successSum + 1
                    }
                    console.log(7)
                } catch (e) {
                    console.log(7, "Err")
                    if (diffDate > 0) {
                        continue
                    } else {
                        return res.status(400).json({status: false, message: "Bad Request"})
                    }
                }
            }

            console.log("i=", i, "diffDate=", diffDate)

            if (i === diffDate) {
                console.log(8)
                if (successSum > 0) {
                    return res.status(201).json({status: true, message: "Date Successfully Added"})
                } else {
                    return res.status(400).json({status: true, message: "Invalid Date"})
                }
            }
        }
    }
}

//api/customdate/get
calendarController.getCustomDate = async (req, res) => {
    console.log(0)
    try {
        console.log(1)
        await CustomDate.sync({hooks: true})
    } catch(e) {
        console.log(1, "Err")
        return res.status(500).json({status: false, message: "Internal Server Error (Sync)"})
    }

    try {
        var customDates = await CustomDate.findAll()
        console.log(3)
        if (customDates.length <= 0) {
            console.log(4)
            return res.status(400).json({status: false, message: "No Any Custom Date Found!"})
        } else {
            console.log(4)
            return res.status(201).json(customDates)
        }
    } catch (e) {
        console.log(3, "Err")
        return res.status(500).json({status: false, message: "Internal Server Error (CustomDate)"})
    }
}

//api/customdate/delete
calendarController.deleteCustomDate = async (req, res) => {
    console.log(0)
    if (typeof req.body.custom_date_id === 'undefined') {
        console.log(1, "Err")
        return res.status(400).json({status: false, message: "Data Incomplete!"})
    } else {
        console.log(1)

        try {
            var idSum = await CustomDate.count({where: {custom_date_id: req.body.custom_date_id}})
            if (idSum === 0) {
                return res.status(400).json({status: false, message: "Custom Date Not Found"})
            } else {
                try {
                    var deleteId = await CustomDate.destroy({where: {custom_date_id: req.body.custom_date_id}})

                    return res.status(201).json({status: true, message: "Custom Date Successfully Deleted"})
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Destroy)"})
                }
            }
        } catch (e) {
            return res.status(500).json({status: false, message: "Internal Server Error (Count)"})
        }
    }
}

//api/customdate/clear
calendarController.clearCustomDate = async () => {
    console.log(0)
    try {
        console.log(1)
        await CustomDate.sync({hooks: true})
    } catch(e) {
        console.log(1, "Err")
        return res.status(500).json({status: false, message: "Internal Server Error (Sync)"})
    }

    try {
        var customNumber = await CustomDate.count()
        if (customNumber === 0) {
            return res.status(400).json({status: false, message: "No Any Custom Date Exists!"})
        } else {
            try {
                await CustomDate.destroy()

                return res.status(201).json({status: true, message: "Custom Dates Successfully Cleared"})
            } catch (e) {
                return res.status(500).json({status: false, message: "Internal Server Error (Destroy)"})
            }
        }
    } catch (e) {
        return res.status(500).json({status: false, message: "Internal Server Error (Count)"})
    }
}

module.exports = calendarController;