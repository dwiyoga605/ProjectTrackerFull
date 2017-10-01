'use strict';

var jwt = require('jsonwebtoken');
var moment = require('moment');
var Sequelize = require('sequelize');
var db = require('../services/database'),
    Function = require('../models/function'),
    Phase = require('../models/phase'),
    Phasename = require('../models/phase_name'),
    HistoricalPhase = require('../models/historical_phase'),
    Project = require('../models/project'),
    Module = require('../models/module'),
    Checklist = require('../models/checklist'),
    User = require('../models/user'),
    Calendar = require('../models/custom_date');

var getWorkDay = async (startDateInt, endDateInt) => {
    var startDate = moment("2017-08-28").hours(0).minutes(0).seconds(0).milliseconds(0)
    var endDate = moment("2017-08-31").hours(0).minutes(0).seconds(0).milliseconds(0)
    var diff = endDate.diff(startDate, "d") + 1
    var weeks = endDate.diff(startDate, "w")
    var workDay = diff - (weeks * 2)

    var startDay = startDate.day()
    var endDay = endDate.day()

    console.log(diff, weeks)

    if (workDay > 0 && (startDay === 0 || startDay === 6) && (endDay === 0 || endDay === 6)) {
        if (startDay === endDay) {
            workDay = workDay - 1
        } else if (startDay != endDay) {
            workDay = workDay - 2
        }
    }
    
    // var days = await Math.ceil((endDateInt-startDateInt)/86400000)
    
    // var weeks = await Math.floor(days/7)
    
    // var workDay = await days - (weeks * 2)
    
    // if (dayStartDate === 6 && dayEndDate != 6) {
    //     workDay = workDay - 1
    // } else if (dayStartDate === 0 && dayEndDate === 6) {
    //     workDay = workDay - 1
    // }

    try {
        var customWorkDay = await Calendar.count({where: {$and: [{custom_date_status: 1},{custom_date_date: {$between: [startDateString, endDateString]}}]}})
    } catch (e) {
        return {status: false, message: "Internal Server Error (Workday On)"}
    }
    
    try {
        var customHoliday = await Calendar.count({where: {$and: [{custom_date_status: 0},{custom_date_date: {$between: [startDateString, endDateString]}}]}})
    } catch (e) {
        return {status: false, message: "Internal Server Error (Workday Off)"}
    }

    console.log(typeof startDateInt, typeof endDateInt, startDateInt, endDateInt, startDateString, endDateString)

    console.log("checkWorkday", workDay, customWorkDay, customHoliday)

    workDay = await workDay + customWorkDay - customHoliday
    
    return {status: true, work_day: workDay}
}

var checkChecklist = async (phaseId, postponeDayCount) => {
    // var dateNow = Date.parse(new Date())
    var dateNow = await parseInt(moment().format('x'))

    try {
        console.log(0)
        var checklistSum = await Checklist.count({where: {checklist_phase_id: phaseId}})
        console.log(1, checklistSum)
    } catch (e) {
        return {status: false, message: "Internal Server Error (Checklist C)"}
    }

    if (checklistSum > 0) {
        try {
            console.log(2)
            var checklistCheckedSum = await Checklist.count({where: {$and: [{checklist_phase_id: phaseId},{checklist_status: 1}]}})
            console.log(3)
        } catch (e) {
            return {status: false, message: "Internal Server Error (Checklist C 2)"}
        }

        try {
            var phaseGet = await Phase.findOne({attribute: ['phase_start_date', 'phase_end_date'], where: {phase_id: phaseId}})
        } catch (e) {
            return {status: false, message: "Internal Server Error (Phase)"}
        }

        // var startDate = await phaseGet.dataValues.phase_start_date
        // var endDate = await phaseGet.dataValues.phase_end_date
        var startDate = await moment(phaseGet.dataValues.phase_start_date).format('YYYY-MM-DD')
        var endDate = await moment(phaseGet.dataValues.phase_end_date).format('YYYY-MM-DD')
        // var dateNow = await new Date().toLocaleDateString()

        var workDayFullRet = await getWorkDay(await parseInt(moment(startDate).format('x')), await parseInt(moment(endDate).format('x')), phaseId)
        console.log(workDayFullRet)
        if (!workDayFullRet.status) {
            return workDayFullRet
        } else {
            var workDayFull = workDayFullRet.work_day
        }

        var workDayNowRet = await getWorkDay(await parseInt(moment(startDate).format('x')), dateNow, phaseId)
        if (!workDayNowRet.status) {
            return workDayNowRet
        } else {
            var workDayNow = workDayNowRet.work_day
        }

        var checklistPerDay = await (Math.floor(checklistSum/workDayFull))
        if (checklistPerDay <= 0) {
            checklistPerDay = 1
        }

        console.log("CheckChecklist", workDayFull, workDayNow, checklistCheckedSum, postponeDayCount, checklistSum, checklistPerDay, checklistPerDay * (workDayNow - postponeDayCount))

        if (checklistPerDay * (workDayNow - postponeDayCount) > checklistCheckedSum) {
            return {status: true, message: "WN"}
        } else {
            return {status: true, message: "NWN"}
        }
    } else {
        return {status: true, message: "NWN"}
    }
}

var getCustomDate = async (startDateInt, endDateInt) => {
    // var startDateInt = Date.parse(startDate)
    // var endDateInt = Date.parse(endDate)

    if (startDateInt > endDateInt) {
        return {status: false, message: "Invalid Date"}
    } else {
        // var limitStartDate = await UsefulProgram.changeDateFormat(new Date(startDateInt).toUTCString())
        // var limitEndDate = await UsefulProgram.changeDateFormat(new Date(endDateInt).toUTCString())
        var limitStartDate = await moment(startDateInt).format('YYYY-MM-DD')
        var limitEndDate = await moment(endDateInt).format('YYYY-MM-DD')

        try {
            var customDate = await Calendar.findAll({where: {custom_date_date: {$and: [{$lte: limitEndDate, $gte: limitStartDate}]}}, order: ['custom_date_date']})
            var customOn = {}
            var customOff = {}
            for (var i=0; i<customDate.length; i++) {
                console.log(customDate[i].custom_date_date, customDate[i].custom_date_status)
                if (!customDate[i].custom_date_status) {
                    // customOff[new Date(Date.parse(customDate[i].custom_date_date)).toLocaleDateString()] = "OFF"
                    customOff[moment(customDate[i].custom_date_date).format('YYYY-MM-DD')] = "OFF"
                } else {
                    // customOn[new Date(Date.parse(customDate[i].custom_date_date)).toLocaleDateString()] = "ON"
                    customOn[moment(customDate[i].custom_date_date).format('YYYY-MM-DD')] = "ON"
                }
            }
            return {status: true, custom_on: customOn, custom_off: customOff}
        } catch (e) {
            return {status: false, message: "Internal Server Error (Calendar)"}
        }
    }
}

var calendarDate = async function(startDateInt, endDateInt, statusDate) {
    // return new Promise(function(resolve, reject) {
        if (startDateInt > endDateInt) {
            // reject("End Date Cannot Bigger Than Start Date")
            return {status: false, message: "Invalid Date"}
        } else {
            // var startDateInt = Date.parse(startDatee)
            // var endDateInt = Date.parse(endDatee)
            // var endDatePlannedInt = Date.parse(endDateePlanned)
            // console.log(startDateInt, endDateInt, startDatee, endDatee)
            // var startDate = new Date(startDatee)
            // var endDate = new Date(endDatee)
            // var endDatePlanned = new Date(endDateePlanned)

            var customOn = {}
            var customOff = {}
            var customDate = await getCustomDate(startDateInt, endDateInt)
            console.log("customDate", customDate)
            if (customDate.status) {
                customOn = customDate.custom_on
                customOff = customDate.custom_off
            } else {
                return {status: false, message: customDate.message}
            }

            console.log("customOnOff", customOn, customOff)

            // console.log(startDate, endDate, statusDate)
    
            // var startDateYear = startDate.getYear() + 1900
            // var endDateYear = endDate.getYear() + 1900
            // var startDateMonth = startDate.getMonth() + 1
            // var endDateMonth = endDate.getMonth() + 1
            // var startDateDate = startDate.getDate()
            // var endDateDate = endDate.getDate()

            var startDateYear = parseInt(moment(startDateInt).format('YYYY'))
            var endDateYear = parseInt(moment(endDateInt).format('YYYY'))
            var startDateMonth = parseInt(moment(startDateInt).format('M'))
            var endDateMonth = parseInt(moment(endDateInt).format('M'))
            var startDateDate = parseInt(moment(startDateInt).format('DD'))
            var endDateDate = parseInt(moment(endDateInt).format('DD'))

            // var postponeCount = 0
            // var updateStatus = ""

            // console.log("calendarDate", startDatee, endDatee, startDateInt, endDateInt, startDate, endDate)
            // console.log("calendarDate", startDateYear, endDateYear)
    
            var calendarDatee = []
            for (var i=startDateYear; i<=endDateYear; i++) {
                if (i == startDateYear) {
                    var j = startDateMonth
                } else {
                    var j=1
                }
    
                if (i == endDateYear) {
                    var limitMonth = endDateMonth
                } else {
                    var limitMonth = 12
                }
    
                // var monthOfYear = {}
                for (; j<=limitMonth; j++) {
                    var calendarMonth = {}
                    calendarMonth["year"] = i
                    calendarMonth["month"] = j
                    /*if (i == endDateYear && j == endDateMonth) {
                        var limitDate = endDateDate
                    } else*/ if (j == 1 || j == 3 || j == 5 || j == 7 || j == 8 || j == 10 || j == 12) {
                        var limitDate = 31
                    } else if (j!=2) {
                        var limitDate = 30
                    } else if (i%4 == 0) {
                        var limitDate = 29
                    } else {
                        var limitDate = 28
                    }
    
                    // if (i == startDateYear && j == startDateMonth) {
                    //     var k = startDateDate
                    // } else {
                    //     var k = 1
                    // }
    
                    var statusDatee = []
                    var dates = []
                    var dateOfMonth = []
                    if (typeof status === 'undefined') {
                        var status = "OP"
                    }
                    for (var k=1; k<=limitDate; k++) {
                        var datee = {}
                        datee["tgl"] = k
                        var yearString = i.toString()
                        if (j < 10) {
                            var monthString = "0" + j.toString()
                        } else {
                            var monthString = j.toString()
                        }
                        if (k < 10) {
                            var dayString = "0" + k.toString()
                        } else {
                            var dayString = k.toString()
                        }
                        var dateString = await yearString + "-" + monthString + "-" + dayString
                        // var dateFormat = Date.parse(dateString)
                        // var dateOfDate = new Date(dateFormat).toLocaleDateString()
                        // var dayOfDate = new Date(dateOfDate).getDay()
                        var dateFormat = await parseInt(moment(dateString).format('x'))
                        var dateOfDate = await moment(dateString).format('YYYY-MM-DD')
                        var dayOfDate =  await parseInt(moment(dateString).format('e'))
                        if ((dayOfDate === 6 || dayOfDate === 0 || typeof customOff[dateOfDate] != 'undefined') && typeof customOn[dateOfDate] === 'undefined') {
                            datee["status"] = "OFF"
                            var statuss = statusDate[dateOfDate]
                            if (typeof statuss != 'undefined') {
                                status = statuss
                            }
                        } else {
                            var statuss = statusDate[dateOfDate]
                            if (typeof statuss != 'undefined') {
                                status = statuss
                            } 
                            
                            // if (status === "OP" && dateFormat > endDatePlannedInt) {
                            //     status = "OD"
                            // } else if (postponeCount > 0) {
                            //     if (status === "OD") {
                            //         status = "OP"
                            //         updateStatus = "OP"
                            //     } else if (status === "FO") {
                            //         if (postponeCount === 0) {
                            //             status = "FT"
                            //             updateStatus = "FT"
                            //         } else {
                            //             status = "FE"
                            //             updateStatus = "FE"
                            //         }
                            //     }
                            // }

                            // if (status === "PP") {
                            //     postponeCount = postponeCount + 1
                            // }

                            // console.log(dateOfDate, startDate.toLocaleDateString(), endDate.toLocaleDateString())
                            // console.log(dateOfDate < startDate.toLocaleDateString(), dateOfDate > endDate.toLocaleDateString())
                            // console.log(status)
                            // console.log(dateFormat, startDateInt, endDateInt, new Date(dateFormat).toLocaleDateString(), new Date(startDateInt).toLocaleDateString(), new Date(endDateInt).toLocaleDateString(), dateFormat < startDateInt, dateFormat > endDateInt)
                            if (dateFormat < startDateInt || dateFormat > endDateInt) {
                                datee["status"] = ""
                            } else {
                                datee["status"] = status
                            }
                        }
                        dateOfMonth.push(datee) 
                    }
                    calendarMonth["data"] = dateOfMonth
                    calendarDatee.push(calendarMonth)
                }
                // calendarDatee[i] = monthOfYear
            }
            // resolve(calendarDatee)
            return {status: true, message: calendarDatee}

            
        }
    // })
}

var dashboardController = {};

//
dashboardController.createDashboardData = async (req, res) => {
    var projectId = req.body.project_id
    var rowNumbers = req.body.row_number
    var pageNumber = req.body.page_number
    var filterSearch = req.body.filter_search
    // console.log(0)

    if (typeof projectId === 'undefined' || projectId <= 0 || typeof rowNumbers === 'undefined' || rowNumbers <= 0 || typeof pageNumber === 'undefined' || pageNumber <= 0) {
        // console.log("Wrong Request")
        return res.status(400).json({status: false, message: "Wrong Request Format"})
    } else  {

        var whereFunction = {}
        var whereUser = {}
        var wherePhase = {}
        var whereModule = {}

        //Set select filter of 'functions' table based on function_name
        if (typeof filterSearch != 'undefined' && typeof filterSearch === 'object') {
            if (typeof filterSearch["function_name"] != 'undefined') {
                whereFunction = {function_name: {$like: '%' + filterSearch["function_name"] + '%'}}
            }
    
            //Set select filter of 'modules' table based on module_name
            if (typeof filterSearch["module_name"] != 'undefined') {
                whereModule = {module_name: {$like: '%' + filterSearch["module_name"] + '%'}}
            }
            
            //Set select filter of 'user_managements' table based on name or employee_id
            if (typeof filterSearch["pic"] != 'undefined') {
                whereUser = {$or:[{name: {$like: '%' + filterSearch["pic"] + '%'}},{employee_id: {$like: '%' + filterSearch["pic"] + '%'}}]}
            }
    
            //Set select filter of 'phases' table based on phasename_name attributes in 'phasenames' table
            if (typeof filterSearch["phase_name"] != 'undefined') {
                // console.log("filterSearch phase_name", filterSearch["phase_name"], "\n")
                var filterPhase = filterSearch["phase_name"]
                // console.log(Array.isArray(filterPhase))
                if (Array.isArray(filterPhase)) {
                    var orFilter = []
                    for (var i=0; i<filterPhase.length; i++) {
                        var filterr = {}
                        orFilter.push({$like: '%' + filterPhase[i] + '%'})
                    }
                    wherePhase = {phasename_name: {$or: orFilter}}
                    console.log(filterPhase, wherePhase)
                }
            }
        }

        try {
            var getPhase = await Phase.findAll({attributes: ['phase_id', 'phase_start_date', 'phase_end_date','phase_status_date','updatedAt', 'createdAt', 'phase_finished_flag', 'phase_postponed_flag', 'progress_percentage'], include:[{model: Function, attributes: ['function_id','function_code', 'function_name'], where: whereFunction, include: [{model: Module, attributes:['module_id', 'module_name'], where: whereModule, include:[{model: Project, attributes:['project_id'], where: {'project_id': projectId}}]}]},{model: User, attributes: ['id_user', 'employee_id','name'], where: whereUser},{model: Phasename, attributes:['phasename_name'], where: wherePhase}], order:[Sequelize.col('module_id', 'functions->modules'), Sequelize.col('function_id', 'functions'), 'phase_id']})
        } catch (e) {
            return res.status(500).json({status: false, message: "Internal Server Error (Phase)"})
        }

        if (getPhase.length <= 0) {
            return res.status(400).json({status: false, message: "No Any Phase Found!"})
        } else {
            console.log("getPhase.length=", getPhase.length ,"rowNumbers=", rowNumbers, Math.ceil(getPhase.length/rowNumbers))
            var pageSum = await Math.ceil(getPhase.length / rowNumbers)
            console.log(pageSum)

            if (pageSum < pageNumber) {
                return res.status(400).json({status: false, message: "No Data at This Page!"})
            } else {
                var firstElement = await (pageNumber - 1) * rowNumbers
                var lastElement = await (firstElement + rowNumbers - 1)
                // (page - 1) * itemsPerPage + 1

                console.log("lastElement=", lastElement ,"firstElement=", firstElement)
                var dataTable = []
                var dashboardData = {}
                var summaryTable = {}
                var summaryUser = {}
                var summaryModule = {}
                var userMap = {}
                var moduleMap = {}
    
                // var statusId = {}
                for (var i=0; i<getPhase.length; i++) {
                    console.log("awalfor", i, firstElement, lastElement)
                    var statusId = {}
                    var phaseId = await getPhase[i].dataValues.phase_id
                    var employeeId = await getPhase[i].dataValues.user_management.employee_id
                    // console.log(employeeId)
                    
                    // console.log(getPhase[i])
                    // console.log(rowData["APIC"], rowData["Phase"])
                    console.log(0)
                    // var startDatePlanned = await Date.parse(getPhase[i].dataValues.phase_start_date)
                    // var endDatePlanned = await Date.parse(getPhase[i].dataValues.phase_end_date)
                    var startDatePlanned = await parseInt(moment(getPhase[i].dataValues.phase_start_date).format('x'))
                    var endDatePlanned = await parseInt(moment(getPhase[i].dataValues.phase_end_date).format('x'))
                    var endDate = await endDatePlanned
                    // var updatedAt = await Date.parse(getPhase[i].dataValues.updatedAt.toLocaleDateString())
                    // var createdAt = await Date.parse(getPhase[i].dataValues.createdAt.toLocaleDateString())
                    var updatedAt = await parseInt(moment(getPhase[i].dataValues.updatedAt).format('x'))
                    var createdAt = await parseInt(moment(getPhase[i].dataValues.createdAt).format('x'))
                    var phaseFinishedFlag = await getPhase[i].dataValues.phase_finished_flag
                    var phasePostponedFlag = await getPhase[i].dataValues.phase_postponed_flag
                    console.log(1)
                    var statusDate = null
                    if (getPhase[i].dataValues.phase_status_date != null) {
                        // statusDate = Date.parse(getPhase[i].dataValues.phase_status_date)
                        statusDate = await parseInt(moment(getPhase[i].dataValues.phase_status_date).format('x'))
                    }

                    var rowData = {}
                    // console.log("alah", getPhase[i].dataValues.user_management.name)
                    rowData["moduleID"] = await getPhase[i].dataValues.function.module.module_id
                    rowData["module"] = await getPhase[i].dataValues.function.module.module_name
                    rowData["code"] = await getPhase[i].dataValues.function.function_code
                    rowData["funcID"] = await getPhase[i].dataValues.function.function_id
                    rowData["funcName"] = await getPhase[i].dataValues.function.function_name
                    rowData["pic_id"] = await getPhase[i].dataValues.user_management.id_user
                    rowData["APIC"] = await getPhase[i].dataValues.user_management.name
                    rowData["phaseID"] = await getPhase[i].dataValues.phase_id
                    rowData["Phase"] = await getPhase[i].dataValues.phase_name.phasename_name
                    rowData["Percentage"] = await (getPhase[i].dataValues.progress_percentage).toString() + '%'
                    // console.log("error")
                    if (typeof summaryUser[employeeId] === 'undefined') {
                        // console.log("if user")
                        var userData = {}
                        userData["name"] = await rowData["APIC"]
                        userData["summary"] = await [0,0,0,0,0,0,0]
                        summaryUser[employeeId] = await userData
                    }
                    // console.log("Next typeof")
                    if (typeof summaryModule[rowData["moduleID"]] === 'undefined') {
                        var moduleData = {}
                        moduleData["name"] = await rowData["module"]
                        moduleData["summary"] = await [0,0,0,0,0,0,0]
                        summaryModule[rowData["moduleID"]] = moduleData
                    }

                    var arraySummaryModule = await summaryModule[rowData["moduleID"]]["summary"]
                    var arraySummaryUser = await summaryUser[employeeId]["summary"]

                    var getHistorical = await HistoricalPhase.findAll({attributes:['historicalphase_phase_id', 'historicalphase_input_date', 'historicalphase_status_date', 'historicalphase_end_date', 'historicalphase_finished_flag', 'historicalphase_postponed_flag'], where:{$and:[{historicalphase_phase_id: phaseId},{historicalphase_historical_kind: '2'}]}, order:['historicalphase_phase_id']})
                    // console.log("getHistorical.length= ", getHistorical.length)
                    if (getHistorical.length <= 0) {
                        //Tidak ada historis status yang tersimpan
                        var statusId = {}
                        // var dateNow = Date.parse(new Date().toLocaleDateString())
                        var dateNow = await parseInt(moment().format('x'))
    
                        // console.log("Something Wrong", phaseFinishedFlag, phasePostponedFlag)
                        // console.log(statusDate)
                        if (phaseFinishedFlag) {
                            // console.log("finishedFlag")
                            // var statusDate = Date.parse(getPhase[i].dataValues.phase_status_date)
                            var statusDate = await parseInt(moment(getPhase[i].dataValues.phase_status_date).format('x'))
                            if (statusDate > endDatePlanned) {
                                console.log(3)
                                // var overdueDate = new Date(new Date(endDatePlanned).getTime() + 1 * 86400000).toLocaleDateString()
                                var overdueDate = await moment(endDatePlanned + 1 * 86400000).format('YYYY-MM-DD')
                                // console.log(overdueDate)
                                statusId[overdueDate] = "OD"
                                // statusId[new Date(statusDate).toLocaleDateString()] = "FO"
                                statusId[await moment(statusDate).format('YYYY-MM-DD')] = "FO"
                                rowData["devStatus"] = "FO"
    
                                arraySummaryModule[4]++
                                arraySummaryUser[4]++
    
                                // endDatePlanned = statusDate
                                endDate = statusDate

                                summaryModule[rowData["moduleID"]]["summary"] = await arraySummaryModule
                                summaryUser[employeeId]["summary"] = await arraySummaryUser

                                var calendarResult = await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    dataTable.push(rowData)
                                }

                                // console.log("FO", overdueDate, statusId, arraySummaryModule, arraySummaryUser, endDate)
                            } else if (statusDate === endDatePlanned) {
                                console.log(3)
                                // statusId[new Date(statusDate).toLocaleDateString()] = "FT"
                                statusId[moment(statusDate).format('YYYY-MM-DD')] = "FT"
                                rowData["devStatus"] = "FT"
    
                                arraySummaryModule[3]++
                                arraySummaryUser[3]++

                                summaryModule[rowData["moduleID"]]["summary"] = await arraySummaryModule
                                summaryUser[employeeId]["summary"] = await arraySummaryUser

                                var calendarResult = await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    dataTable.push(rowData)
                                }
                            } else {
                                console.log(3)
                                // statusId[new Date(statusDate).toLocaleDateString()] = "FE"
                                statusId[moment(statusDate).format('YYYY-MM-DD')] = "FE"
                                rowData["devStatus"] = "FE"
    
                                arraySummaryModule[2]++
                                arraySummaryUser[2]++
    
                                // endDatePlanned = statusDate
                                endDate = statusDate

                                summaryModule[rowData["moduleID"]]["summary"] = await arraySummaryModule
                                summaryUser[employeeId]["summary"] = await arraySummaryUser

                                var calendarResult = await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    dataTable.push(rowData)
                                }
                            }
                        } else if (phasePostponedFlag) {
                            // var statusDate = Date.parse(getPhase[i].dataValues.phase_status_date)
                            var statusDate = await parseInt(moment(getPhase[i].dataValues.phase_status_date).format('x'))
                            console.log(3)
                            // console.log("postponedFlag")
                            // statusId[new Date(statusDate).toLocaleDateString()] = "PP"
                            statusId[moment(statusDate).format('YYYY-MM-DD')] = "PP"
                            rowData["devStatus"] = "PP"
    
                            arraySummaryModule[6]++
                            arraySummaryUser[6]++

                            endDate = dateNow

                            summaryModule[rowData["moduleID"]]["summary"] = await arraySummaryModule
                            summaryUser[employeeId]["summary"] = await arraySummaryUser

                            var calendarResult = await calendarDate(startDatePlanned, endDate, statusId)
                            rowData["checkList"] = await calendarResult.message
        
                            // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                            if (i >= firstElement && i <= lastElement) {
                                dataTable.push(rowData)
                            }
                        } else {
                            // console.log("OP/OD/PL")
                            console.log(dateNow, endDatePlanned, startDatePlanned, new Date(dateNow).toLocaleDateString(), new Date(endDatePlanned).toLocaleDateString(), new Date(startDatePlanned).toLocaleDateString(), dateNow > endDatePlanned, dateNow < startDatePlanned, dateNow === startDatePlanned)
                            if (dateNow > endDatePlanned) {
                                console.log(3)
                                console.log("If 1")
                                // var overdueDate = new Date(new Date(endDatePlanned).getTime() + 1 * 86400000).toLocaleDateString()
                                var overdueDate = await moment(endDatePlanned + 1 * 86400000).format('YYYY-MM-DD')
                                console.log(overdueDate)
                                // statusId[new Date(startDatePlanned).toLocaleDateString()] = "OP"
                                statusId[overdueDate] = "OD"
                                rowData["devStatus"] = "OD"
    
                                // console.log("summaryUser", summaryUser[employeeId]["summary"][5]++)
                                arraySummaryModule[5]++
                                arraySummaryUser[5]++
    
                                // endDatePlanned = dateNow
                                endDate = dateNow

                                summaryModule[rowData["moduleID"]]["summary"] = await arraySummaryModule
                                summaryUser[employeeId]["summary"] = await arraySummaryUser

                                var calendarResult = await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    dataTable.push(rowData)
                                }
                            } else if (dateNow < startDatePlanned) {
                                console.log(3)
                                // console.log("If 2")
                                // statusId[new Date(startDatePlanned).toLocaleDateString()] = "PL"
                                statusId[moment(startDatePlanned).format('YYYY-MM-DD')] = "PL"
                                rowData["devStatus"] = "PL"
    
                                // console.log("summaryUser", summaryUser[employeeId]["summary"][0]++)
                                arraySummaryModule[0]++
                                arraySummaryUser[0]++

                                summaryModule[rowData["moduleID"]]["summary"] = await arraySummaryModule
                                summaryUser[employeeId]["summary"] = await arraySummaryUser

                                var calendarResult = await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    dataTable.push(rowData)
                                }
                            } else {
                                console.log(3)
                                // console.log("If 3")
                                //Check warning or not
                                var statusWarning = await checkChecklist(phaseId, 0)
                                console.log(statusWarning)

                                if (!statusWarning.status) {
                                    return res.status(500).json({status: false, message: statusWarning.message + " (CW)"})
                                } else {
                                    if (statusWarning.message === "WN") {
                                        // statusId[new Date(startDatePlanned).toLocaleDateString()] = "OP"
                                        statusId[moment(startDatePlanned).format('YYYY-MM-DD')] = "OP"

                                        // statusId[new Date(dateNow).toLocaleDateString()] = "WN"
                                        statusId[moment(dateNow).format('YYYY-MM-DD')] = "WN"
                                        rowData["devStatus"] = "WN"
                                    } else {
                                        // statusId[new Date(startDatePlanned).toLocaleDateString()] = "OP"
                                        statusId[moment(startDatePlanned).format('YYYY-MM-DD')] = "OP"
                                        rowData["devStatus"] = "OP"
                                    }
                                }



                                // statusId[new Date(startDatePlanned).toLocaleDateString()] = "OP"
                                // rowData["devStatus"] = "OP"
    
                                // console.log("summaryUser", summaryUser[employeeId]["summary"][1]++)
                                arraySummaryModule[1]++
                                arraySummaryUser[1]++

                                summaryModule[rowData["moduleID"]]["summary"] = await arraySummaryModule
                                summaryUser[employeeId]["summary"] = await arraySummaryUser

                                var calendarResult = await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    dataTable.push(rowData)
                                }

                                //Check warning
    
                                // if (dateNow < endDatePlanned) {
                                //     var overdueDate = new Date(new Date(endDatePlanned).getTime() + 1 * 86400000).toLocaleDateString()
                                //     // endDatePlanned = dateNow
                                // }
                            }
                            console.log("Finish status")
                            // summaryModule[rowData["moduleID"]]["summary"] = await arraySummaryModule
                            // summaryUser[employeeId]["summary"] = await arraySummaryUser

                            console.log("Finish set status", summaryModule, summaryUser)
        
                            //masuk ke calendardate
                            // var calendarResult = await calendarDate(await UsefulProgram.changeDateFormat(new Date(startDatePlanned).toUTCString()), await UsefulProgram.changeDateFormat(new Date(endDate).toUTCString()), statusId)
                            console.log("Masuk CalendarDate")
                            // var calendarResult = await calendarDate(startDatePlanned, endDate, statusId)
                            // rowData["checkList"] = await calendarResult.message
        
                            // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                            // if (i >= firstElement && i <= lastElement) {
                            //     dataTable.push(rowData)
                            // }
                        }
                    } else {
                        //Ada historis status yang tersimpan
                        var lastStatus = ""
                        var lastStatusDate = null
                        var endDateStandard = endDate
                        var postponeDaySumAll = 0

                        console.log("length =", getHistorical.length)
                        for (var j=0; j<getHistorical.length; j++) {
                            // console.log("j=", j)
                            console.log(getHistorical[j])
                            var historicalFinishedFlag = await getHistorical[j].dataValues.historicalphase_finished_flag
                            var historicalPostponedFlag = await getHistorical[j].dataValues.historicalphase_postponed_flag
                            // var historicalInputDate = await Date.parse(getHistorical[j].dataValues.historicalphase_input_date)
                            var historicalInputDate = await parseInt(moment(getHistorical[j].dataValues.historicalphase_input_date).format('x'))
                            console.log("lewat")
                            if (historicalFinishedFlag) {
                                // var historicalStatusDate = Date.parse(getHistorical[j].dataValues.historicalphase_status_date)
                                var historicalStatusDate = parseInt(moment(getHistorical[j].dataValues.historicalphase_status_date).format('x'))

                                if (lastStatus === "FO" || lastStatus === "FE" || lastStatus === "FT") {
                                    return res.status(500).json({status: false, message: "Historical Data Error"})
                                } else if (lastStatus === "PP") {
                                    var dateDiff = Math.ceil(Math.abs(historicalStatusDate - lastStatusDate)/86400000)
                                    endDateStandard = endDateStandard + dateDiff
                                    postponeDaySumAll = postponeDaySumAll + dateDiff
                                }

                                if (historicalStatusDate < endDateStandard) {
                                    // statusId[new Date(historicalStatusDate).toLocaleDateString()] = "FE"
                                    statusId[moment(historicalStatusDate).format('YYYY-MM-DD')] = "FE"
                                    lastStatus = "FE"
                                    lastStatusDate = historicalStatusDate
                                } else if (historicalStatusDate === endDateStandard) {
                                    // statusId[new Date(historicalStatusDate).toLocaleDateString()] = "FT"
                                    statusId[moment(historicalStatusDate).format('YYYY-MM-DD')] = "FT"
                                    lastStatus = "FT"
                                    lastStatusDate = historicalStatusDate
                                } else {
                                    var overdueDateGuess = (endDate +  1 * 86400000)
                                    var overdueDate = endDateStandard + (endDateStandard - overdueDateGuess)
                                    if (typeof statusId[moment(overdueDate).format('YYYY-MM-DD')] === 'undefined') {
                                        statusId[moment(overdueDate).format('YYYY-MM-DD')] = "OD"
                                    }

                                    // statusId[new Date(historicalStatusDate).toLocaleDateString()] = "FO"
                                    statusId[moment(historicalStatusDate).format('YYYY-MM-DD')] = "FO"
                                    lastStatus = "FO"
                                    lastStatusDate = historicalStatusDate
                                }
                            } else if (historicalPostponedFlag) {
                                if (lastStatus != "PP") {
                                    // var historicalStatusDate = Date.parse(getHistorical[j].dataValues.historicalphase_status_date)
                                    var historicalStatusDate = await parseInt(moment(getHistorical[j].dataValues.historicalphase_status_date).format('x'))
                                    lastStatus = "PP"
                                    lastStatusDate = historicalStatusDate
                                    // statusId[new Date(historicalStatusDate).toLocaleDateString()] = "PP"
                                    statusId[moment(historicalStatusDate).format('YYYY-MM-DD')] = "PP"
                                } else {
                                    return res.status(500).json({status: false, message: "Historical Data Error!"})
                                }
                            } else {
                                //On Progress / Overdue
                                // var inputDate = Date.parse(new Date(getHistorical[j].dataValues.historicalphase_input_date))
                                var inputDate = await parseInt(moment(getHistorical[j].dataValues.historicalphase_input_date).format('x'))
                                if (lastStatus === "OP" || lastStatus === "OD") {
                                    return res.status(500).json({status: false, message: "Historical Data Error!"})
                                } else if (lastStatus === "PP") {
                                    var dateDiff = Math.ceil(Math.abs(historicalStatusDate - lastStatusDate)/86400000)
                                    endDateStandard = endDateStandard + dateDiff
                                    postponeDaySumAll = postponeDaySumAll + dateDiff
                                }

                                var statusDateNow = historicalInputDate

                                // if (i === (getHistorical.length - 1)) {
                                //     if (phaseFinishedFlag || phasePostponedFlag) {
                                //         var nextStatusDate = Date.parse(getPhase[i].dataValues.phase_status_date)
                                //         if (historicalInputDate > nextStatusDate) {
                                //             var statusDateNow = nextStatusDate - 1 * 86400000
                                //         } else {
                                //             var statusDateNow = historicalInputDate
                                //         }
                                //     }
                                // } else {
                                //     hpFFNext = getHistorical[j+1].dataValues.historicalphase_finished_flag
                                //     hpPFNext = getHistorical[j+1].dataValues.historicalphase_postponed_flag
                                //     if (hpFFNext || hpPPNext) {
                                //         var nextStatusDate = Date.parse(getHistorical[j+1].dataValues.historicalphase_status_date)
                                //         if (historicalInputDate > nextStatusDate) {
                                //             var statusDateNow = nextStatusDate - 1 * 86400000
                                //         } else {
                                //             var statusDateNow = historicalInputDate
                                //         }
                                //     }
                                // }

                                if (statusDateNow > endDateStandard) {
                                    if (typeof statusId[moment(statusDateNow).format('YYYY-MM-DD')] != 'undefined') {
                                        statusId[moment(statusDateNow).format('YYYY-MM-DD')] = "OD"
                                    }
                                } else {
                                    if (typeof statusId[moment(statusDateNow).format('YYYY-MM-DD')] != 'undefined') {
                                        statusId[moment(statusDateNow).format('YYYY-MM-DD')] = "OP"
                                    }
                                }
                            }
                        }

                        // var dateNow = Date.parse(new Date().toLocaleDateString())
                        var dateNow = parseInt(moment().format('x'))
                        //Set status now
                        console.log("Set status now")
                        if (phaseFinishedFlag) {
                            // var statusDate = Date.parse(getPhase[i].dataValues.phase_status_date)
                            var statusDate = parseInt(moment(getPhase[i].dataValues.phase_status_date).format('x'))

                            if (lastStatus === "FO" || lastStatus === "FE" || lastStatus === "FT") {
                                return res.status(500).json({status: false, message: "Historical Data Error"})
                            } else if (lastStatus === "PP") {
                                var dateDiff = Math.ceil(Math.abs(statusDate - lastStatusDate)/86400000)
                                endDateStandard = endDateStandard + dateDiff
                                postponeDaySumAll = postponeDaySumAll + dateDiff
                            }

                            if (statusDate < endDateStandard) {
                                // statusId[new Date(statusDate).toLocaleDateString()] = "FE"
                                statusId[moment(statusDate).format('YYYY-MM-DD')] = "FE"
                                rowData["devStatus"] = "FE"

                                arraySummaryModule[2]++
                                arraySummaryUser[2]++

                                endDate = statusDate

                                summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                                summaryUser[employeeId]["summary"] = arraySummaryUser
    
                                var calendarResult =  await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    await dataTable.push(rowData)
                                }

                            } else if (statusDate === endDateStandard) {
                                // statusId[new Date(statusDate).toLocaleDateString()] = "FT"
                                statusId[moment(statusDate).format('YYYY-MM-DD')] = "FT"
                                rowData["devStatus"] = "FT"

                                arraySummaryModule[3]++
                                arraySummaryUser[3]++

                                summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                                summaryUser[employeeId]["summary"] = arraySummaryUser
    
                                var calendarResult =  await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    await dataTable.push(rowData)
                                }
                            } else {
                                var overdueDateGuess = (endDate +  1 * 86400000)
                                var overdueDate = endDateStandard + (endDateStandard - overdueDateGuess)

                                if (statusId[moment(overdueDate).format('YYYY-MM-DD')] != "PP" || typeof statusId[moment(overdueDate).format('YYYY-MM-DD')] != 'undefined') {
                                    statusId[moment(overdueDate).format('YYYY-MM-DD')] = "OD"
                                }
                                // statusId[new Date(statusDate).toLocaleDateString()] = "FO"
                                statusId[moment(statusDate).format('YYYY-MM-DD')] = "FO"
                                rowData["devStatus"] = "FO"

                                arraySummaryModule[4]++
                                arraySummaryUser[4]++

                                endDate = statusDate

                                summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                                summaryUser[employeeId]["summary"] = arraySummaryUser
    
                                var calendarResult =  await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    await dataTable.push(rowData)
                                }
                            }
                        } else if (phasePostponedFlag) {
                            if (lastStatus === "PP") {
                                return res.status(500).json({status: false, message: "Historical Data Error"})
                            } else {
                                var statusDate = parseInt(moment(getPhase[i].dataValues.phase_status_date).format('x'))
                                statusId[moment(statusDate).format('YYYY-MM-DD')] = "PP"
                                rowData["devStatus"] = "PP"
    
                                arraySummaryModule[6]++
                                arraySummaryUser[6]++
    
                                endDate = dateNow

                                summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                                summaryUser[employeeId]["summary"] = arraySummaryUser
    
                                var calendarResult =  await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    await dataTable.push(rowData)
                                }
                            }
                        } else {
                            // var updatedAt = Date.parse(new Date(getPhase[i].dataValues.updatedAt).toLocaleDateString())
                            var updatedAt = await parseInt(moment(getPhase[i].dataValues.updatedAt).format('x'))
                            console.log(updatedAt, endDateStandard)

                            if (lastStatus === "OP" || lastStatus === "OD") {
                                return res.status(500).json({status: false, message: "Historical Data Error!"})
                            } else if (lastStatus === "PP") {
                                var dateDiff = Math.ceil(Math.abs(updatedAt - lastStatusDate)/86400000)
                                endDateStandard = endDateStandard + dateDiff
                                postponeDaySumAll = postponeDaySumAll + dateDiff
                            }
                            
                            // if (lastStatus === "FO" || lastStatus === "FE" || lastStatus === "FT") {
                            //     var statusDateNow = lastStatusDate + 1 * 86400000
                            // } else if (lastStatus === "PP") {
                            //     // var updatedAt = Date.parse(new Date(getPhase[]))
                            //     // var lastStatusBefore = last
                            // } else {
                            //     return res.status(500).json({status: false, message: "Historical Data Error"})
                            // }

                            if (updatedAt > endDateStandard) {
                                // statusId[new Date(updatedAt).toLocaleDateString()] = "OD"
                                statusId[moment(updatedAt).format('YYYY-MM-DD')] = "OD"
                                rowData["devStatus"] = "OD"

                                arraySummaryModule[5]++
                                arraySummaryUser[5]++

                                endDate = dateNow

                                summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                                summaryUser[employeeId]["summary"] = arraySummaryUser
    
                                var calendarResult =  await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    await dataTable.push(rowData)
                                }
                            } else if (updatedAt < endDateStandard) {
                                //Check warning or not
                                var statusWarning = await checkChecklist(phaseId, postponeDaySumAll)
                                console.log(statusWarning, postponeDaySumAll)

                                if (!statusWarning.status) {
                                    return res.status(500).json({status: false, message: statusWarning.message + " (CW)"})
                                } else {
                                    if (statusWarning.message === "WN") {
                                        // var beforeWarning = updatedAt - 1 * 86400000
                                        // statusId[new Date(beforeWarning).toLocaleDateString()] = "OP"

                                        // statusId[new Date(updatedAt).toLocaleDateString()] = "WN"
                                        statusId[moment(updatedAt).format('YYYY-MM-DD')] = "WN"
                                        rowData["devStatus"] = "WN"
                                    } else {
                                        // statusId[new Date(updatedAt).toLocaleDateString()] = "OP"
                                        statusId[moment(updatedAt).format('YYYY-MM-DD')] = "OP"
                                        rowData["devStatus"] = "OP"
                                    }
                                }

                                arraySummaryModule[1]++
                                arraySummaryUser[1]++

                                endDate = dateNow

                                summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                                summaryUser[employeeId]["summary"] = arraySummaryUser
    
                                var calendarResult =  await calendarDate(startDatePlanned, endDate, statusId)
                                rowData["checkList"] = await calendarResult.message
            
                                // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                                if (i >= firstElement && i <= lastElement) {
                                    await dataTable.push(rowData)
                                }
                            }

                            // summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                            // summaryUser[employeeId]["summary"] = arraySummaryUser

                            // var calendarResult =  await calendarDate(startDatePlanned, endDate, statusId)
                            // rowData["checkList"] = await calendarResult.message
        
                            // // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                            // if (i >= firstElement && i <= lastElement) {
                            //     await dataTable.push(rowData)
                            // }
                            // console.log(statusId)
                        }

                        summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                        summaryUser[employeeId]["summary"] = arraySummaryUser
    
                        //masuk ke calendardate
                        // console.log("Masuk ke calendardate", )
                        // console.log(statusId)
                        // var calendarResult = await calendarDate(new Date(startDatePlanned).toLocaleDateString(), new Date(endDate).toLocaleDateString(), statusId)
                        var calendarResult =  await calendarDate(startDatePlanned, endDate, statusId)
                        rowData["checkList"] = await calendarResult.message
    
                        console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                        if (i >= firstElement && i <= lastElement) {
                            dataTable.push(rowData)
                        }
                    }

                    // if (createdAt != updatedAt) {
                    //     try {
                    //         var getHistorical = await HistoricalPhase.findAll({attributes:['historicalphase_phase_id', 'historicalphase_input_date', 'historicalphase_status_date', 'historicalphase_end_date', 'historicalphase_finished_flag', 'historicalphase_postponed_flag'], where:{$and:[{historicalphase_phase_id: phaseId},{historicalphase_historical_kind: '2'}]}, order:['historicalphase_phase_id']})
                    //     } catch (e) {
                    //         return res.status(500).json({status: false, message: "Internal Server Error (HP)"})
                    //     }

                    //     var lastIsPostpone = false
                    //     // var lastIsFinished = false
                    //     var endDateStandard = endDatePlanned
                    //     var hpPostponeDate = null
                    //     var postponeDaySumAll = 0
                    //     var postponeDaySum = 0
                    //     console.log("getHistorical.length", getHistorical.length)
                    //     for (var j=0; j<getHistorical.length; j++) {
                    //         console.log("Historical")
                    //         var hpPhaseId = await getHistorical[j].dataValues.historicalphase_phase_id
                    //         var hpFinishedFlag = await getHistorical[j].dataValues.historicalphase_finished_flag
                    //         var hpPostponedFlag = await getHistorical[j].dataValues.historicalphase_postponed_flag
                    //         var hpInputDate = await Date.parse(getHistorical[j].dataValues.historicalphase_input_date)
                    //         console.log(getHistorical)

                    //         var hpStatusDate = null
                    //         if (getHistorical[j].dataValues.historicalphase_status_date != null) {
                    //             hpStatusDate = Date.parse(getHistorical[j].dataValues.historicalphase_status_date)
                    //         }

                    //         if (hpFinishedFlag) {
                    //             if (lastIsPostpone) {
                    //                 var dateDiff = Math.abs(hpStatusDate - hpPostponeDate)
                    //                 endDateStandard = endDateStandard + dateDiff
                    //                 postponeDaySumAll = postponeDaySumAll + dateDiff

                    //                 lastIsPostpone = false
                    //             }

                    //             if (hpStatusDate > endDateStandard) {
                    //                 console.log(8)
                    //                 statusId[new Date(hpStatusDate).toLocaleDateString()] = "FO"
                    //             } else if (hpStatusDate === endDateStandard) {
                    //                 console.log(8)
                    //                 statusId[new Date(hpStatusDate).toLocaleDateString()] = "FT"
                    //             } else {
                    //                 console.log(8)
                    //                 statusId[new Date(hpStatusDate).toLocaleDateString()] = "FE"
                    //             }
                    //         } else if (hpPostponedFlag) {
                    //             lastIsPostpone = true
                    //             console.log(8)
                    //             hpPostponeDate = hpStatusDate
                    //             statusId[new Date(hpStatusDate).toLocaleDateString()] = "PP"
                    //         } else {
                    //             if (i === getHistorical.length - 1) {
                    //                 if (phaseFinishedFlag || phasePostponedFlag) {
                    //                     var statusDateNow = Date.parse(getPhase[i].dataValues.phase_status_date)
                    //                 } else {
                    //                     var statusDateNow = hpInputDate
                    //                 }
                    //             } else {
                    //                 hpFFNext = getHistorical[j+1].dataValues.historicalphase_finished_flag
                    //                 hpPFNext = getHistorical[j+1].dataValues.historicalphase_postponed_flag
                    //                 if (hpFFNext || hpPFNext) {
                    //                     var statusDateNow = Date.parse(getHistorical[j+1].dataValues.phase_status_date)
                    //                 } else {
                    //                     var statusDateNow = hpInputDate
                    //                 }
                    //             }

                    //             if (lastIsPostpone) {
                    //                 var dateDiff = Math.abs(statusDateNow - hpPostponeDate)
                    //                 endDateStandard = endDateStandard + dateDiff
                    //                 postponeDaySumAll = postponeDaySumAll + dateDiff

                    //                 lastIsPostpone = false
                    //             }

                    //             if (statusDateNow > endDateStandard) {
                    //                 console.log(8)
                    //                 statusId[new Date(statusDateNow).toLocaleDateString()] = "OD"
                    //             } else {
                    //                 console.log(8)
                    //                 statusId[new Date(statusDateNow).toLocaleDateString()] = "OP"
                    //             }
                    //         }
                    //     }

                    //     //Yang lagi di edit
                    //     if (phaseFinishedFlag) {
                    //         if (lastIsPostpone) {
                    //             var dateDiff = Math.abs(statusDate - hpPostponeDate)
                    //             endDateStandard = endDateStandard + dateDiff
                    //             postponeDaySumAll = postponeDaySumAll + dateDiff

                    //             lastIsPostpone = false
                    //         }
                    //         // statusId["endDatePlanned"] = endDatePlanned
                    //         if (statusDate > endDateStandard) {
                    //             console.log(3)
                    //             statusId[new Date(statusDate).toLocaleDateString()] = "FO"
                    //             rowData["devStatus"] = "FO"
    
                    //             arraySummaryModule[4]++
                    //             arraySummaryUser[4]++
    
                    //             // endDateStandard = statusDate
                    //             endDate = statusDate
                    //         } else if (statusDate === endDateStandard) {
                    //             console.log(3)
                    //             statusId[new Date(statusDate).toLocaleDateString()] = "FT"
                    //             rowData["devStatus"] = "FT"
    
                    //             arraySummaryModule[3]++
                    //             arraySummaryUser[3]++
                    //         } else {
                    //             console.log(3)
                    //             statusId[new Date(statusDate).toLocaleDateString()] = "FE"
                    //             rowData["devStatus"] = "FE"
    
                    //             arraySummaryModule[2]++
                    //             arraySummaryUser[2]++
    
                    //             // endDateStandard = statusDate
                    //             if (endDateStandard < dateNow) {
                    //                 endDateStandard = dateNow
                    //             }
                    //             // endDate = statusDate
                    //         }
                    //     } else if (phasePostponedFlag) {
                    //         console.log(3)
                    //         // console.log("postponedFlag")
                    //         statusId[new Date(statusDate).toLocaleDateString()] = "PP"
                    //         rowData["devStatus"] = "PP"
                    //         // statusId["endDateStandard"] = endDateStandard
    
                    //         arraySummaryModule[6]++
                    //         arraySummaryUser[6]++
                    //     } else {
                    //         // statusId["endDateStandard"] = endDateStandard
                    //         var statusDateBeforeSt = getHistorical[getHistorical.length - 1].dataValues.historicalphase_status_date
                    //         var statusDateBefore = await Date.parse(statusDateBeforeSt)

                    //         if (updatedAt > statusDateBefore) {
                    //             var dateStandard = statusDateBefore
                    //         } else {
                    //             var dateStandard = updatedAt
                    //         }

                    //         if (dateStandard > endDateStandard) {
                    //             console.log(3)
                    //             console.log("If 1")
                    //             var overdueDate = new Date(new Date(endDateStandard).getTime() + 1 * 86400000).toLocaleDateString()
                    //             // statusId[startDatePlanned] = "OP"
                    //             console.log(overdueDate)
                    //             statusId[overdueDate] = "OD"
                    //             rowData["devStatus"] = "OD"
    
                    //             // console.log("summaryUser", summaryUser[employeeId])
                    //             arraySummaryModule[5]++
                    //             arraySummaryUser[5]++
    
                    //             // endDateStandard = dateNow
                    //             if (endDateStandard < dateNow) {
                    //                 endDateStandard = dateNow
                    //             }
                    //             // endDate = dateNow
                    //         } else {
                    //             console.log(3)
                    //             console.log("If 3")
                                
                    //             var checkWarning = await checkChecklist(phaseId, postponeDaySumAll)

                    //             if (checkWarning.status) {
                    //                 if (checkWarning.message != "WN") {
                    //                     statusId[new Date(dateStandard).toLocaleDateString()] = "OP"
                    //                 } else {
                    //                     statusId[new Date(dateStandard).toLocaleDateString()] = "WN"
                    //                 }
                    //             } else {
                    //                 return res.status(500).json({status: false, message: "Internal Server Error (Warning)"})
                    //             }
                    //             rowData["devStatus"] = "OP"
    
                    //             // console.log("summaryUser", summaryUser[employeeId])
                    //             arraySummaryModule[1]++
                    //             arraySummaryUser[1]++
    
                    //             // if (dateNow < endDateStandard) {
                    //             //     endDateStandard = dateNow
                    //             // }
                    //         }
                    //     }
                    //     endDate = endDateStandard

                    // } else {
                    //     var statusId = {}
                    //     var dateNow = Date.parse(new Date())
                    //     // console.log(dateNow)
                    //     var statusDate = null
                    //     // console.log(getPhase[i].dataValues.phase_status_date, typeof getPhase[i].dataValues.phase_status_date != 'null', getPhase[i].dataValues.phase_status_date === null)
                    //     if (getPhase[i].dataValues.phase_status_date != null) {
                    //         // console.log("statusDate")
                    //         statusDate = Date.parse(getPhase[i].dataValues.phase_status_date)
                    //     }
    
                    //     // console.log("Something Wrong", phaseFinishedFlag, phasePostponedFlag)
                    //     // console.log(statusDate)
                    //     if (phaseFinishedFlag) {
                    //         // console.log("finishedFlag")
                    //         if (statusDate > endDatePlanned) {
                    //             console.log(3)
                    //             var overdueDate = new Date(new Date(endDatePlanned).getTime() + 1 * 86400000).toLocaleDateString()
                    //             statusId[overdueDate] = "OD"
                    //             statusId[new Date(statusDate).toLocaleDateString()] = "FO"
                    //             rowData["devStatus"] = "FO"
    
                    //             arraySummaryModule[4]++
                    //             arraySummaryUser[4]++
    
                    //             // endDatePlanned = statusDate
                    //             endDate = statusDate
                    //         } else if (statusDate === endDatePlanned) {
                    //             console.log(3)
                    //             statusId[new Date(statusDate).toLocaleDateString()] = "FT"
                    //             rowData["devStatus"] = "FT"
    
                    //             summaryModule[rowData["moduleID"]]["summary"][3]++
                    //             summaryUser[employeeId]["summary"][3]++
                    //         } else {
                    //             console.log(3)
                    //             statusId[new Date(statusDate).toLocaleDateString()] = "FE"
                    //             rowData["devStatus"] = "FE"
    
                    //             arraySummaryModule[2]++
                    //             arraySummaryUser[2]++
    
                    //             // endDatePlanned = statusDate
                    //             endDate = statusDate
                    //         }
                    //     } else if (phasePostponedFlag) {
                    //         console.log(3)
                    //         // console.log("postponedFlag")
                    //         statusId[new Date(statusDate).toLocaleDateString()] = "PP"
                    //         rowData["devStatus"] = "PP"
    
                    //         arraySummaryModule[6]++
                    //         arraySummaryUser[6]++
                    //     } else {
                    //         // console.log("OP/OD/PL")
                    //         // console.log(dateNow, endDatePlanned, dateNow > endDatePlanned, dateNow < startDatePlanned, datNow === startDatePlanned)
                    //         if (dateNow > endDatePlanned) {
                    //             console.log(3)
                    //             console.log("If 1")
                    //             var overdueDate = new Date(new Date(endDatePlanned).getTime() + 1 * 86400000).toLocaleDateString()
                    //             console.log(overdueDate)
                    //             statusId[new Date(startDatePlanned).toLocaleDateString()] = "OP"
                    //             statusId[overdueDate] = "OD"
                    //             rowData["devStatus"] = "OD"
    
                    //             // console.log("summaryUser", summaryUser[employeeId]["summary"][5]++)
                    //             arraySummaryModule[5]++
                    //             arraySummaryUser[5]++
    
                    //             // endDatePlanned = dateNow
                    //             endDate = dateNow
                    //         } else if (dateNow < startDatePlanned) {
                    //             console.log(3)
                    //             // console.log("If 2")
                    //             statusId[new Date(startDatePlanned).toLocaleDateString()] = "PL"
                    //             rowData["devStatus"] = "PL"
    
                    //             // console.log("summaryUser", summaryUser[employeeId]["summary"][0]++)
                    //             arraySummaryModule[0]++
                    //             arraySummaryUser[0]++
                    //         } else {
                    //             console.log(3)
                    //             // console.log("If 3")
                    //             statusId[new Date(startDatePlanned).toLocaleDateString()] = "OP"
                    //             rowData["devStatus"] = "OP"
    
                    //             // console.log("summaryUser", summaryUser[employeeId]["summary"][1]++)
                    //             arraySummaryModule[1]++
                    //             arraySummaryUser[1]++

                    //             //Check warning
    
                    //             // if (dateNow < endDatePlanned) {
                    //             //     var overdueDate = new Date(new Date(endDatePlanned).getTime() + 1 * 86400000).toLocaleDateString()
                    //             //     // endDatePlanned = dateNow
                    //             // }
                    //         }
                    //     }
                    // }
                    // summaryModule[rowData["moduleID"]]["summary"] = arraySummaryModule
                    // summaryUser[employeeId]["summary"] = arraySummaryUser

                    // //masuk ke calendardate
                    // var calendarResult = await calendarDate(startDatePlanned, endDate, endDatePlanned, statusId)
                    // rowData["checkList"] = await calendarResult.message

                    // console.log("i=", i ,"firstElement=", firstElement ,"lastElement=", lastElement)
                    // if (i >= firstElement && i <= lastElement) {
                    //     dataTable.push(rowData)
                    // }
                }

                summaryTable["pic"] = summaryUser
                summaryTable["module"] = summaryModule

                dashboardData["table"] = dataTable
                dashboardData["summary"] = summaryTable
                dashboardData["page_count"] = pageSum
                dashboardData["page_number"] = pageNumber

                return res.status(200).json(dashboardData)
            }
        }
    }
}

module.exports = dashboardController
