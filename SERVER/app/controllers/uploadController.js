'use strict';

var Sequelize = require('sequelize');
var moment = require('moment');
var fs = require('fs');
var db = require('../services/database');
var Multer = require('multer');
var config = require('../config');
var Access = require('./accessController');
var ProjectUpload = require('../models/upload_project'),
    DesignUpload = require('../models/upload_design');
var ExcelFile = require('xlsx'),
    UsefulProgram = require('../programs/usefulProgram'),
    DefaultConst = require('../const/defaultConst');
var Project = require('../models/project'),
    Module = require('../models/module'),
    Function = require('../models/function'),
    Phase = require('../models/phase'),
    Phasename = require('../models/phase_name'),
    User = require('../models/user');

var projectExcelConverter = async (excel_filename) => {
    console.log(0)
    var workbook = ExcelFile.readFile(excel_filename)
    var sheet_name_list = workbook.SheetNames;
    var worksheet = workbook.Sheets[sheet_name_list[0]]
    var return_json = {}
    var project_json = {}
    var module_added = {}
    var function_added = {}
    var module_json = []
    var function_json = []
    var phase_json = []
    var cell_used = []
    var change_module = false
    var change_function = false
    var last_module = ""
    var last_function = ""
    var module_start_date_min = 0
    var module_end_date_max = 0
    var function_start_date_min = 0
    var function_end_date_max = 0
    var project_start_date_min = 0
    var project_end_date_max = 0

    var startDate = 0
    var endDate = 0
    project_json["project_name"] = worksheet["C1"].v
    project_json["project_client_name"] = worksheet["C2"].v
    project_json["project_client_address"] = worksheet["C3"].v
    project_json["project_client_phone"] = "0" + worksheet["C4"].v.toString()
    project_json["project_client_email"] = worksheet["C5"].v

    var keys = Object.keys(worksheet)
    var keys_use = keys.slice(20,keys.length-2)
    for (var z=0; z<keys_use.length;) {
        cell_used.push(keys_use[z])
        if (keys_use[z][0] === "A") {
            ++z;
            continue;
        } else if (keys_use[z][0] === "B") {
            var module_code = worksheet[keys_use[z]].v
            var module_name = worksheet[keys_use[z+1]].v
            var keys_module = Object.keys(module_added)
            if (keys_module.indexOf(module_code) === -1) {
                var module_object = {}
                module_object["module_code"] = module_code
                module_object["module_name"] = module_name
                // module_object["module_start_date"] = ""
                // module_object["module_end_date"] = ""
                module_object["project_name"] = project_json["project_name"]
                module_added[module_code] = module_name
                module_json.push(module_object)

                if (module_json.length >= 2) {
                    change_module = true
                }

                // change_module = true
            }
            z+=2
            continue
        } else if (keys_use[z][0] === "D") {
            console.log(1)
            var function_code = worksheet[keys_use[z]].v
            var function_name = worksheet[keys_use[z+1]].v
            var keys_function = Object.keys(function_added)
            if (keys_function.indexOf(function_code) === -1) {
                var function_object = {}
                function_object["function_code"] = function_code
                function_object["function_name"] = function_name
                // function_object["function_start_date"] = ""
                // function_object["function_end_date"] = ""
                function_object["module_code"] = module_code
                function_added[function_code] = worksheet[function_added]
                function_json.push(function_object)
                console.log(2)
                
                if (function_json.length >= 2) {
                    change_function = true
                }
            }
            z += 2;
            continue
        } else {
            var phase_name = worksheet[keys_use[z]].v
            var pic_username = worksheet[keys_use[z+1]].v
            var phase_start_date = await moment(worksheet[keys_use[z+2]].w).format('YYYY-MM-DD')
            var phase_end_date = await moment(worksheet[keys_use[z+3]].w).format('YYYY-MM-DD')
            var phase_object = {}
            console.log(worksheet[keys_use[z+2]].w, moment(worksheet[keys_use[z+2]].w), worksheet[keys_use[z+2]])
            phase_object["phase_name"] = phase_name
            phase_object["pic_username"] = pic_username
            phase_object["phase_start_date"] = phase_start_date
            phase_object["phase_end_date"] = phase_end_date
            phase_object["function_code"] = function_code
            phase_json.push(phase_object)

            startDate = parseInt(moment(worksheet[keys_use[z+2]].w).format('x'))
            endDate = parseInt(moment(worksheet[keys_use[z+3]].w).format('x'))

            z += 4;
        }

        // if (phase_json.length === 1) {
        //     console.log("start")
        //     function_start_date_min = startDate
        //     function_end_date_max = endDate

        //     module_start_date_min = function_start_date_min
        //     module_end_date_max = function_end_date_max

        //     project_start_date_min = module_start_date_min
        //     project_end_date_max = module_end_date_max
        // } else if (function_start_date_min != 0 && function_end_date_max != 0) {
        //     console.log("compare function")
        //     if (function_start_date_min > startDate) {
        //         function_start_date_min = startDate
        //     }

        //     if (function_end_date_max < endDate) {
        //         function_end_date_max = endDate
        //     }
        // } else {
        //     console.log("input function")
        //     function_start_date_min = startDate
        //     function_end_date_max = endDate
        // }

        // if (module_start_date_min === 0 && module_end_date_max === 0) {
        //     function_start_date_min = startDate
        //     function_end_date_max = endDate
        // }

        // if (change_function) {
        //     if (module_start_date_min > function_start_date_min) {
        //         module_start_date_min = function_start_date_min
        //     }

        //     if (module_end_date_max < function_end_date_max) {
        //         module_end_date_max = function_end_date_max
        //     }

        //     var functionModule = function_json[function_json.length - 2]
        //     functionModule["function_start_date"] = await moment(function_start_date_min).format("YYYY-MM-DD")
        //     functionModule["function_end_date"] = await moment(function_end_date_max).format("YYYY-MM-DD")
        //     function_json[function_json.length - 2] = functionModule

        //     console.log("change_function", function_start_date_min, function_end_date_max, functionModule["function_code"])

        //     function_start_date_min = 0
        //     function_end_date_max = 0

        //     change_function = false
        // } else if (change_module) {
        //     if (project_start_date_min > module_start_date_min) {
        //         project_start_date_min = module_start_date_min
        //     }

        //     if (project_end_date_max < module_end_date_max) {
        //         project_end_date_max = module_end_date_max
        //     }

        //     var moduleModule = module_json[module_json.length - 2]
        //     moduleModule["module_start_date"] = await moment(module_start_date_min).format("YYYY-MM-DD")
        //     moduleModule["module_end_date"] = await moment(module_end_date_max).format("YYYY-MM-DD")
        //     module_json[module_json.length - 2] = moduleModule

        //     console.log("change_module", module_start_date_min, module_end_date_max, moduleModule["module_code"])

        //     module_start_date_min = 0
        //     module_end_date_max = 0

        //     change_module = false
        // }

        // console.log(module_name, function_code, phase_name)
        // console.log(function_json.length, module_json.length, change_function, change_module)
        // console.log(function_start_date_min, function_end_date_max, module_start_date_min, module_end_date_max, project_start_date_min, project_end_date_max)
        // console.log(moment(function_start_date_min).format("YYYY-MM-DD"), moment(function_end_date_max).format("YYYY-MM-DD"), moment(module_start_date_min).format("YYYY-MM-DD"), moment(module_end_date_max).format("YYYY-MM-DD"), moment(project_start_date_min).format("YYYY-MM-DD"), moment(project_end_date_max).format("YYYY-MM-DD"))
    }

    // console.log("after for")
    // if (function_start_date_min != 0 && function_end_date_max != 0 && module_start_date_min != 0 && module_end_date_max != 0) {
    //     if (module_start_date_min > function_start_date_min) {
    //         module_start_date_min = function_start_date_min
    //     }

    //     if (module_end_date_max < function_end_date_max) {
    //         module_end_date_max = function_end_date_max
    //     }

    //     if (project_start_date_min > module_start_date_min) {
    //         project_start_date_min = module_start_date_min
    //     }

    //     if (project_end_date_max < module_end_date_max) {
    //         project_end_date_max = module_end_date_max
    //     }
    // } else if (module_start_date_min != 0 && module_end_date_max != 0) {
    //     if (project_start_date_min > module_start_date_min) {
    //         project_start_date_min = module_start_date_min
    //     }

    //     if (project_end_date_max < module_end_date_max) {
    //         project_end_date_max = module_end_date_max
    //     }
    // }

    // project_json["project_start_date"] = project_start_date_min
    // project_json["project_end_date"] = project_end_date_max

    return_json["project"] = project_json
    return_json["modules"] = module_json
    return_json["functions"] = function_json
    return_json["phases"] = phase_json

    return return_json
}

var checkFormatFile = async (filename, formatfile) => {
    var regexp = new RegExp('(\\S|\\s)*.(' + formatfile + ')')

    if (regexp.test(filename)) {
        return true
    } else {
        return false
    }
}

var changeDate = async (projectId, moduleIds, functionIds, phaseIds) => {
    // try {
    //     var transDate = await db.transaction()
    // } catch (e) {
    //     return {status: false, code:500, message: "Internal Server Error (Transaction Date)"}
    // }

    for (var i=0; i<functionIds.length; i++) {
        var startDateMin = await Phase.min('phase_start_date', {where: {phase_function_id: functionIds[i]}})
        var endDateMax = await Phase.max('phase_end_date', {where: {phase_function_id: functionIds[i]}})
        try {
            await Function.update({function_start_date: startDateMin, function_end_date: endDateMax}, {where: {function_id: functionIds[i]}})            
        } catch (e) {
            // await transDate.rollback()
            return {status: false, code: 500, message: "Internal Server Error (Date Function)"}
        }
    }

    for (var i=0; i<moduleIds.length;i++) {
        var startDateMin = await Function.min('function_start_date', {where: {function_module_id: moduleIds[i]}})
        var endDateMax = await Function.max('function_end_date', {where: {function_module_id: moduleIds[i]}})
        try {
            await Module.update({module_start_date: startDateMin, module_end_date: endDateMax}, {where: {module_id: moduleIds[i]}})            
        } catch (e) {
            // await transDate.rollback()
            return {status: false, code: 500, message: "Internal Server Error (Date Module)"}
        }
    }

    try {
        var startDateMin = await Module.min('module_start_date', {where: {module_project_id: projectId}})
        var endDateMax = await Module.max('module_end_date', {where: {module_project_id: projectId}})
        await Project.update({project_start_date: startDateMin, project_end_date: endDateMax}, {where: {project_id: projectId}})                    
    } catch (e) {
        // await transDate.rollback()
        return {status: false, code: 500, message: "Internal Server Error (Date Project)"}
    }

    // await transDate.commit()
    return {status: true, message: ""}
}

var uploadToDatabase = async (mapExcel, userId, filename) => {
    try {
        var transUpload = await db.transaction()
    } catch (e) {
        return {status: false, code: 500, message: "Internal Server Error (Transaction)"}
    }

    try {
        var projectMap = mapExcel["project"]
        var newProject = {
            project_name: projectMap.project_name,
            project_client_name: projectMap.project_client_name,
            project_client_address: projectMap.project_client_address,
            project_client_phone: projectMap.project_client_phone,
            project_client_email: projectMap.project_client_email,
            project_manager_id: userId
        }

        var projectId = await Project.create(newProject, {transaction: transUpload})
    } catch (e) {
        transUpload.rollback()
        return {status: false, code: 500, message: "Internal Server Error (Create Project)"}
    }

    try {
        // console.log(0)
        var modulesMap = mapExcel["modules"]
        // console.log(1)
        var moduleMaps = {}
        var moduleIds = []
        // console.log(2)
        // console.log(modulesMap)

        for (var i=0; i<modulesMap.length; i++) {
            // console.log(3)
            // console.log(modulesMap[i].module_name)
            // console.log(modulesMap[i].module_code)
            // console.log(projectId.dataValues.project_id)
            var newModule = {
                module_name: modulesMap[i].module_name,
                module_code_name: modulesMap[i].module_code,
                module_project_id: projectId.dataValues.project_id,
            }
            // console.log(4)

            var moduleId = await Module.create(newModule, {transaction: transUpload})
            // console.log(5)
            moduleMaps[newModule.module_code_name] = moduleId.dataValues.module_id
            moduleIds.push(moduleId.dataValues.module_id)
            // console.log(6)
        }
    } catch (e) {
        transUpload.rollback()
        return {status: false, code: 500, message: "Internal Server Error (Create Module)"}
    }

    try {
        var functionMap = mapExcel["functions"]
        var functionMaps = {}
        var functionIds = []

        if (typeof moduleMaps[functionMap[i].module_code] === 'undefined') {
            await transUpload.rollback()
            return {status: false, code: 400, message: "Module Code "+functionMap[i].module_code+" Not Found!"}
        }

        for (var i=0; i<functionMap.length; i++) {
            var newFunction = {
                function_name: functionMap[i].function_name,
                function_code: functionMap[i].function_code,
                function_module_id: moduleMaps[functionMap[i].module_code]
            }

            var functionId = await Function.create(newFunction, {transaction: transUpload})

            functionMaps[functionMap[i].function_code] = await functionId.dataValues.function_id
            functionIds.push(functionId.dataValues.function_id)
            // console.log(functionMap[i].function_code," = ",functionId.dataValues.function_id)
        }
        // await transUpload.commit()
    } catch (e) {
        await transUpload.rollback()
        return {status: false, code: 500, message: "Internal Server Error (Create Function)"}
    }

    // await sleep(120*1000)

    try {
        // var transPhase = await db.transaction()
        // console.log(1)
        var phaseMap = mapExcel["phases"]
        var phaseMaps = {}
        var phaseIds = []
        // console.log(2)

        for (var i=0; i<phaseMap.length; i++) {
            // console.log(3)
            var phase = phaseMap[i].phase_name
            // console.log(4)

            if (typeof functionMaps[phaseMap[i].function_code] === 'undefined') {
                await transUpload.rollback()
                return {status: false, code: 400, message: "Module Code "+functionMap[i].function_code+" Not Found!"}
            }

            // console.log(5)
            var phasename = await Phasename.findOrCreate({attributes: ["phasename_id"], where: {phasename_name: phase}, transaction: transUpload})
            // console.log(phasename)
            var phasenameId = phasename[0].dataValues.phasename_id

            // console.log(12)
            var picUsername = phaseMap[i].pic_username
            // console.log(13)
            var checkExistPIC = await User.findOne({attributes: ["id_user"], where: {username: picUsername}})
            // console.log(14)

            if (checkExistPIC === null) {
                await transUpload.rollback()
                return {status: false, code: 400, message: "PIC ("+picUsername+") Not Found"}
            } else {
                // console.log(15)
                var picId = checkExistPIC.dataValues.id_user
                // console.log(16)
            }
            // console.log(17)
            // console.log(phaseMap[i].function_code, functionMaps[phaseMap[i].function_code])
            var newPhase = {
                phase_start_date: phaseMap[i].phase_start_date,
                phase_end_date: phaseMap[i].phase_end_date,
                phase_status_date: null,
                phase_finished_flag: false,
                phase_postponed_flag: false,
                phase_note: "",
                progress_percentage: 0,
                phase_function_id: functionMaps[phaseMap[i].function_code],
                phase_PIC_id: picId,
                phase_phasename_id: phasenameId
            }
            // console.log(18)
            // var function_name = "haha"
            // var function_code = "haha"
            var phase = await Phase.create(newPhase, {transaction: transUpload})
            phaseIds.push(phase.dataValues.phase_id)
            // transUpload.rollback()
            // console.log(19)
            // phaseMaps[newPhase.phase_code] = phaseId.dataValues.phase_id
            // console.log(20)
        }
    } catch (e) {
        await transUpload.rollback()
        return {status: false, code: 500, message: "Internal Server Error (Create Phase)"}
    }

    try {
        var dateNow = new Date()
        // console.log("projectId=", projectId.dataValues.project_id)
        var newProject = {
            projectupload_uploaded_date: dateNow,
            projectupload_file_name: filename,
            projectupload_project_id: projectId.dataValues.project_id,
            projectupload_uploaded_by: userId
        }
        await ProjectUpload.create(newProject, {transaction: transUpload})
    } catch (e) {
        await transUpload.rollback()
        return {status: false, code: 500, message: "Internal Server Error (Create PU)"}
    }

    await transUpload.commit()

    var statusUpdateDate = await changeDate(projectId.dataValues.project_id, moduleIds, functionIds, phaseIds)
    if (!statusUpdateDate.status) {
        // await transUpload.rollback()
        return {status: false, code: statusUpdateDate.code, message: statusUpdateDate.message}
    } else {
        // await transUpload.commit()
        return {status: true, message: ""}
    }
}

var UploadController = {};

//api/project/upload
UploadController.uploadProject = async (req, res) => {
    var token = await req.headers.authorization
    var pathUpload = DefaultConst.uploadProject

    var accessStatus = await Access.checkAuthentication("project", "upload", null, token)
    console.log(6, accessStatus)
    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    } else if (!accessStatus.auth) {
        return res.status(403).json({status: false, message: "Unauthorized"})
    } else {
        var uploader = Multer().single('project_file')
        console.log(11)
        uploader(req, res, async (err) => {
            console.log(12, req.file)
            console.log(err)
            if (err) {
                console.log(15)
                return res.status(500).json({status: false, message: "Internal Server Error"})
            }
            console.log(16)
            var checkFormat = await checkFormatFile(req.file.originalname, "xlsx")
            if (!checkFormat) {
                if (fs.existsSync(pathUpload + req.file.filename)) {
                    fs.unlinkSync(pathUpload + req.file.filename)
                }
                return res.status(400).json({status: false, message: "Wrong Format File"})
            } else {
                try {
                    var decodedToken = await UsefulProgram.decodeToken(token)
                    var userId = await decodedToken.id_user
                    var newName = await req.file.filename + "_project_" + userId + ".xlsx"
                    fs.renameSync(pathUpload + req.file.filename, pathUpload + newName)
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Rename)"})
                }
            }

            var mapExcel = await projectExcelConverter(pathUpload + newName)
            console.log(mapExcel)
            // return res.status(201).json({status: true, message: "Project Successfully Uploaded"})
            var uploadDB = await uploadToDatabase(mapExcel, userId, pathUpload + newName)
            
            if (!uploadDB.status) {
                if (fs.existsSync(pathUpload + newName)) {
                    fs.unlinkSync(pathUpload + newName)
                }
                return res.status(uploadDB.code).json({status: false, message: uploadDB.message})
            } else {
                return res.status(201).json({status: true, message: "Project Successfully Uploaded"})
            }

            // return res.status(201).json({status: true, message: await projectExcelConverter(pathUpload + newName)})

            // return res.status(201).json({status: true, message: "File Successfully Uploaded"})
        })
            // console.log(11)
    }

}

//api/design/upload/phase_id
UploadController.uploadDesign = async (req, res) => {
    console.log(0)
    if (typeof req.query.phase_id === 'undefined') {
        return res.status(400).json({status: false, message: "Bad Request!"})
    } else {
        var token = await req.headers.authorization
        var pathUpload = DefaultConst.uploadDesign
        var phaseId = await req.query.phase_id
    
        var accessStatus = await Access.checkAuthentication("design", "upload", null, token)
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: accessStatus.message})
        } else {
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            } else {
                var uploader = Multer().single('design_file')
                uploader(req, res, async (err) => {
                    if (err) {
                        console.log(15)
                        return res.status(500).json({status: false, message: "Internal Server Error"})
                    }
                    console.log(16)
                    var checkFormat = await checkFormatFile(req.file.originalname, "pdf")
                    if (!checkFormat) {
                        if (fs.existsSync(pathUpload + req.file.filename)) {
                            fs.unlinkSync(pathUpload + req.file.filename)
                        }
                        return res.status(400).json({status: false, message: "Wrong Format File"})
                    } else {
                        try {
                            var decodedToken = await UsefulProgram.decodeToken(token)
                            var userId = await decodedToken.id_user
                            var newName = await phaseId.toString() + "_design_" + userId + ".pdf"
                            fs.renameSync(pathUpload + req.file.filename, pathUpload + newName)
                        } catch (e) {
                            return res.status(500).json({status: false, message: "Internal Server Error (Rename)"})
                        }

                        //Put on database
                        try {
                            var dateNow = moment()

                            var designCheck = await DesignUpload.count({where: {design_phase_id: phaseId}})

                            if (designCheck <= 0) {
                                var newDesign = {
                                    design_uploaded_date: dateNow,
                                    design_file_name: pathUpload + newName,
                                    design_accepted_flag: false,
                                    design_phase_id: phaseId,
                                    design_uploaded_by: userId
                                }
                                await DesignUpload.create(newDesign)
                            } else {
                                var updateDesign = {
                                    design_uploaded_date: dateNow,
                                    design_file_name: pathUpload + newName,
                                    design_accepted_flag: false,
                                    design_uploaded_by: userId
                                }
                                await DesignUpload.update(updateDesign, {where: {design_phase_id: phaseId}})
                            }
                            return res.status(201).json({status: true, message: "Design Successfully Uploaded"})
                        } catch (e) {
                            if (fs.existsSync(pathUpload + newName)) {
                                await fs.unlinkSync(pathUpload + newName)
                            }
                            return res.status(500).json({status: false, message: "Internal Server Error (To DB)"})
                        }
                    }
                })
            }
        }
    }
}

module.exports = UploadController