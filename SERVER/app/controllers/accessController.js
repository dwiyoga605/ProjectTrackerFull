'use strict';

var jwt = require('jsonwebtoken')
var Sequelize = require('sequelize')
var Function = require('../models/function'),
    Phase = require('../models/phase'),
    Phasename = require('../models/phase_name'),
    Project = require('../models/project'),
    Module = require('../models/module'),
    Checklist = require('../models/checklist'),
    User = require('../models/user');
// var Access = require('./accessController');

var mapAccess = {}
var accessController = {}

accessController.checkAuthentication = async (level, activity, levelId, token) => {
    if (!token || !level || !activity) {
        return {status: false, auth: false, message: "Bad Request"}
    } else {
        var decoded_token = jwt.decode(token.split(" ")[1])
        var userId = decoded_token.id_user
        console.log(0, userId)
        console.log(level, activity, level === "checklist")
        var user = await User.findOne({attributes: ['role'], where: {$and: [{id_user: userId}, {verified_status: 'accept'}]}})
        var userRole = user.dataValues.role
        console.log(1, userRole)
        if (level === "project") {
            console.log(2)
            if (activity === "get") {
                console.log(userRole, userId)
                if (userRole === "1") {
                    await console.log("PM")
                    try {
                        var projects = await Project.findAll({attributes: ["project_id"], where: {project_manager_id: userId}})
                        // console.log(projects)
                        if (projects.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            // console.log("else")
                            var projectIds = []
                            for (var i=0; i<projects.length; i++) {
                                // console.log(projectIds)
                                projectIds.push(projects[i].dataValues.project_id)

                                if (i === projects.length - 1) {
                                    return {status: true, auth: true, projects_id: projectIds}
                                }
                            }
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                } else if (userRole === "2" || userRole === "3") {
                    try {
                        var projects = await Phase.findAll({where: {phase_PIC_id: userId}, include:[{model: Function, include: {model: Module, attributes: ['module_project_id']}}]})

                        if (projects.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var projectIds = []
                            for (var i=0; i<projects.length; i++) {
                                projectIds.push(projects[i].dataValues.function.module.module_project_id)

                                if (i === projects.length - 1) {
                                    return {status: true, auth: true, projects_id: projectIds}
                                }
                            }

                            // return {status: true, auth: true, projects_id: projectIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                } else {
                    try {
                        var projects = await Project.findAll({attributes: ["project_id"]})

                        if (projects.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var projectIds = []
                            for (var i=0; i<projects.length; i++) {
                                projectIds.push(projects[i].dataValues.project_id)

                                if (i === projects.length - 1) {
                                    return {status: true, auth: true, projects_id: projectIds}
                                }
                            }

                            // return {status: true, auth: true, project_ids: projectIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                }
            } else if (activity === "edit") {
                if (!levelId) {
                    return {status: false, message: "Bad Request!"}
                } else {
                    if (userRole === "2" || userRole === "3") {
                        return {status: true, auth: false}
                    } else if (userRole === "1") {
                        try {
                            var projectCount = await Project.count({where: {$and: [{project_manager_id: userId}, {project_id: levelId}]}})
                            if (projectCount <= 0) {
                                return {status: true, auth: false}
                            } else {
                                return {status: true, auth: true}
                            }
                        } catch (e) {
                            return {status: false, auth: false}
                        }
                    } else {
                        return {status: true, auth: true}
                    }
                }
            } else if (activity === "add") {
                if (userRole === "2" || userRole === "3") {
                    return {status: true, auth: false}
                } else {
                    return {status: true, auth: true}
                }
            } else if (activity === "upload") {
                console.log(4)
                if (userRole === "2" || userRole === "3") {
                    return {status: true, auth: false}
                } else {
                    console.log(5)
                    return {status: true, auth: true}
                }
            }

        //Module
        } else if (level === "module") {
            if (activity === "get") {
                if (userRole === "1") {
                    try {
                        var modules = await Module.findAll({attributes: ["module_id"], include: [{model: Project, where: {project_manager_id: userId}}]})

                        if (modules.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var moduleIds = []
                            for (var i=0; i<modules.length; i++) {
                                moduleIds.push(modules[i].dataValues.module_id)

                                if (i === modules.length - 1) {
                                    return {status: true, auth: true, modules_id: moduleIds}
                                }
                            }

                            // return {status: true, auth: true, modules_id: moduleIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                } else if (userRole === "2" || userRole === "3") {
                    try {
                        var modules = await Phase.findAll({where: {phase_PIC_id: userId}, include:[{model: Function, attributes: ['function_module_id']}]})

                        if (modules.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var moduleIds = []
                            for (var i=0; i<modules.length; i++) {
                                moduleIds.push(modules[i].dataValues.module.function_module_id)

                                if (i === modules.length - 1) {
                                    return {status: true, auth: true, modules_id: moduleIds}
                                }
                            }

                            // return {status: true, auth: true, projects_id: projectIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                } else {
                    try {
                        var modules = await Module.findAll({attributes: ["module_id"]})

                        if (modules.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var moduleIds = []
                            for (var i=0; i<modules.length; i++) {
                                moduleIds.push(modules[i].dataValues.module_id)

                                if (i === modules.length - 1) {
                                    return {status: true, auth: true, modules_id: moduleIds}
                                }
                            }

                            // return {status: true, auth: true, module_ids: moduleIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                }
            } else if (activity === "edit") {
                if (!levelId) {
                    return {status: false, message: "Bad Request!"}
                } else {
                    if (userRole === "2" || userRole === "3") {
                        return {status: true, auth: false}
                    } else if (userRole === "1") {
                        try {
                            var moduleCount = await Module.count({include: [{model: Project, where: {project_manager_id: userId}}], where: {module_id: levelId}})
                            if (moduleCount <= 0) {
                                return {status: true, auth: false}
                            } else {
                                return {status: true, auth: true}
                            }
                        } catch (e) {
                            return {status: false, auth: false}
                        }
                    } else {
                        return {status: true, auth: true}
                    }
                }
            } else if (activity === "add") {
                if (userRole === "2" || userRole === "3") {
                    return {status: true, auth: false}
                } else {
                    return {status: true, auth: true}
                }
            }

        //Function
        } else if (level === "function") {
            if (activity === "get") {
                if (userRole === "1") {
                    console.log("function get", userRole)
                    try {
                        var functions = await Function.findAll({include: [{model: Module, include: [{model: Project}]}], where: {'$module.project.project_manager_id$': userId}})

                        if (functions.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var functionIds = []
                            for (var i=0; i<functions.length; i++) {
                                functionIds.push(functions[i].dataValues.function_id)

                                if (i === functions.length - 1) {
                                    return {status: true, auth: true, functions_id: functionIds}
                                }
                            }

                            // return {status: true, auth: true, modules_id: moduleIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                } else if (userRole === "2" || userRole === "3") {
                    try {
                        var functions = await Phase.findAll({attributes: ['phase_function_id'], where: {phase_PIC_id: userId}})

                        if (functions.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var functionIds = []
                            for (var i=0; i<functions.length; i++) {
                                functionIds.push(functions[i].dataValues.phase_function_id)

                                if (i === functions.length - 1) {
                                    return {status: true, auth: true, functions_id: functionIds}
                                }
                            }

                            // return {status: true, auth: true, projects_id: projectIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                } else {
                    try {
                        var functions = await Function.findAll({attributes: ["function_id"]})

                        if (functions.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var functionIds = []
                            for (var i=0; i<functions.length; i++) {
                                functionIds.push(functions[i].dataValues.function_id)

                                if (i === functions.length - 1) {
                                    return {status: true, auth: true, functions_id: functionIds}
                                }
                            }

                            // return {status: true, auth: true, module_ids: moduleIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                }
            } else if (activity === "edit") {
                if (!levelId) {
                    return {status: false, message: "Bad Request!"}
                } else {
                    if (userRole === "2" || userRole === "3") {
                        return {status: true, auth: false}
                    } else if (userRole === "1") {
                        try {
                            var functionCount = await Function.count({include: [{model: Module, include: [{model: Project, where: {project_manager_id: userId}}]}], where: {function_id: levelId}})
                            if (functionCount <= 0) {
                                return {status: true, auth: false}
                            } else {
                                return {status: true, auth: true}
                            }
                        } catch (e) {
                            return {status: false, auth: false}
                        }
                    } else {
                        return {status: true, auth: true}
                    }
                }
            } else if (activity === "add") {
                if (userRole === "2" || userRole === "3") {
                    return {status: true, auth: false}
                } else {
                    return {status: true, auth: true}
                }
            }

        //Phase
        } else if (level === "phase") {
            if (activity === "get") {
                if (userRole === "1") {
                    try {
                        var phases = await Phase.findAll({attributes: ["phase_id"],include: [{model: Function, include: [{model: Module, include: [{model: Project,where: {project_manager_id: userId}}]}]}]})

                        if (phases.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var phaseIds = []
                            for (var i=0; i<phases.length; i++) {
                                phaseIds.push(phases[i].dataValues.phase_id)

                                if (i === phases.length - 1) {
                                    return {status: true, auth: true, phases_id: phaseIds}
                                }
                            }

                            // return {status: true, auth: true, modules_id: moduleIds}
                        }
                    } catch (e) {
                        console.log(e)
                        return {status: false, auth: false}
                    }
                } else if (userRole === "2" || userRole === "3") {
                    try {
                        var phases = await Phase.findAll({attributes: ['phase_id'], where: {phase_PIC_id: userId}})

                        if (phases.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var phaseIds = []
                            for (var i=0; i<phases.length; i++) {
                                phaseIds.push(phases[i].dataValues.phase_id)

                                if (i === phases.length - 1) {
                                    return {status: true, auth: true, phases_id: phaseIds}
                                }
                            }

                            // return {status: true, auth: true, projects_id: projectIds}
                        }
                    } catch (e) {
                        console.log("dddd")
                        return {status: false, auth: false}
                    }
                } else {
                    try {
                        var phases = await Phase.findAll({attributes: ["phase_id"]})

                        if (phases.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var phaseIds = []
                            for (var i=0; i<phases.length; i++) {
                                phaseIds.push(phases[i].dataValues.phase_id)

                                if (i === phases.length - 1) {
                                    return {status: true, auth: true, phases_id: phaseIds}
                                }
                            }

                            // return {status: true, auth: true, module_ids: moduleIds}
                        }
                    } catch (e) {
                        console.log("eeeee")
                        return {status: false, auth: false}
                    }
                }
            } else if (activity === "edit") {
                if (!levelId) {
                    return {status: false, message: "Bad Request!"}
                } else {
                    if (userRole === "2" || userRole === "3") {
                        return {status: true, auth: false}
                    } else if (userRole === "1") {
                        try {
                            var phaseCount = await Phase.count({include: [{model: Function, include: [{model: Module, include: [{model: Project, where: {project_manager_id: userId}}]}]}], where: {phase_id: levelId}})
                            if (phaseCount <= 0) {
                                return {status: true, auth: false}
                            } else {
                                return {status: true, auth: true}
                            }
                        } catch (e) {
                            return {status: false, auth: false}
                        }
                    } else {
                        return {status: true, auth: true}
                    }
                }
            } else if (activity === "add") {
                if (userRole === "2" || userRole === "3") {
                    return {status: true, auth: false}
                } else {
                    return {status: true, auth: true}
                }
            }

        //Checklist
        } else if (level === "checklist") {
            console.log("Enter checklist", activity, activity === "get")
            if (activity === "get") {
                console.log("masuk get")
                if (userRole === "1") {
                    // console.log("masuk userRole 1")
                    try {
                        var checklists = await Checklist.findAll({attributes: ["checklist_id"], include: [{model: Phase, include: [{model: Function, include: [{model: Module, include: [{model: Project}]}]}]}], where: {'$phase->function->module->project.project_manager_id$': userId}})

                        // console.log(checklists, checklists.length)

                        if (checklists.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var checklistIds = []
                            
                            for (var i=0; i<checklists.length; i++) {
                                checklistIds.push(checklists[i].dataValues.checklist_id)

                                if (i === checklists.length - 1) {
                                    return {status: true, auth: true, checklists_id: checklistIds}
                                }
                            }

                            // return {status: true, auth: true, modules_id: moduleIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                } else if (userRole === "2" || userRole === "3") {
                    try {
                        var checklists = await Checklist.findAll({attributes: ['checklist_id'], include: [{model: Phase, where: {phase_PIC_id: userId}}]})
                        // console.log(checklists, checklists.length)
                        if (checklists.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            // console.log("checklist length dibawah 0")
                            var checklistIds = []
                            for (var i=0; i<checklists.length; i++) {
                                checklistIds.push(checklists[i].dataValues.checklist_id)
                            }

                            return {status: true, auth: true, checklists_id: checklistIds}

                            // return {status: true, auth: true, projects_id: projectIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                } else {
                    try {
                        var checklists = await Checklist.findAll({attributes: ["checklist_id"]})

                        if (checklists.length <= 0) {
                            return {status: true, auth: false}
                        } else {
                            var checklistIds = []
                            for (var i=0; i<checklists.length; i++) {
                                checklistIds.push(checklists[i].dataValues.checklist_id)

                                if (i === checklists.length - 1) {
                                    return {status: true, auth: true, checklists_id: checklistIds}
                                }
                            }

                            // return {status: true, auth: true, module_ids: moduleIds}
                        }
                    } catch (e) {
                        return {status: false, auth: false}
                    }
                }
            } else if (activity === "checked") {
                if (!levelId) {
                    return {status: false, message: "Bad Request!"}
                } else {
                    if (userRole === "2" || userRole === "3") {
                        try {
                            var checklistCount = await Checklist.count({where: {checklist_id: levelId}, include: [{model: Phase, where: {phase_PIC_id: userId}}]})
                            if (checklistCount <= 0) {
                                return {status: true, auth: false}
                            } else {
                                return {status: true, auth: true}
                            }
                        } catch (e) {
                            return {status: false, auth: false}
                        }
                    } else if (userRole === "1") {
                        try {
                            var checklistCount = await Checklist.count({where: {checklist_id: levelId}, include: [{model: Phase, include: [{model: Function, include: [{model: Module, include: [{model: Project, where: {project_manager_id: userId}}]}]}]}]})
                            if (checklistCount <= 0) {
                                return {status: true, auth: false}
                            } else {
                                return {status: true, auth: true}
                            }
                        } catch (e) {
                            return {status: false, auth: false}
                        }
                    } else {
                        return {status: true, auth: true}
                    }
                }
            } else if (activity === "edit") {
                if (!levelId) {
                    return {status: false, message: "Bad Request!"}
                } else {
                    if (userRole === "2" || userRole === "3") {
                        return {status: true, auth: false}
                    } else if (userRole === "1") {
                        try {
                            var checklistCount = await Checklist.count({where: {checklist_id: levelId}, include: [{model: Phase, include: [{model: Function, include: [{model: Module, include: [{model: Project, where: {project_manager_id: userId}}]}]}]}]})
                            if (checklistCount <= 0) {
                                return {status: true, auth: false}
                            } else {
                                return {status: true, auth: true}
                            }
                        } catch (e) {
                            return {status: false, auth: false}
                        }
                    } else {
                        return {status: true, auth: true}
                    }
                }
            } else {
                if (userRole === "2" || userRole === "3") {
                    return {status: true, auth: false}
                } else {
                    return {status: true, auth: true}
                }
            }

        //Others
        } else if (level === "design") {
            if (activity === "upload") {
                if (levelId) {
                    return {status: false, message: "Bad Request"}
                } else {
                    if (userRole === "3") {
                        return {status: true, auth: false}
                    } else if (userRole === "2") {
                        try {
                            var phase = await Phase.count({include: [{model: Phasename, where: {phasename_name: "Design"}}], where: {phase_id: levelId, phase_PIC_id: userId}})                            
                        } catch (e) {
                            return {status: false, message: "Internal Server Error"}
                        }


                        if (phase <= 0) {
                            return {status: true, auth: false}
                        } else {
                            return {status: true, auth: true, picId: userId}
                        }
                    } else if (userRole === "1") {
                        try {
                            var phase = await Phase.count({include: [{model: Function, include: [{model: Module, include: [{model: Project}]}]}, {model: Phasename, where: {phasename_name: "Design"}}], where: {'$function->module->project.project_manager_id': userId}})                            
                        } catch (e) {
                            return {status: false, message: "Internal Server Error"}
                        }

                        if (phase <= 0) {
                            return {status: true, auth: false}
                        } else {
                            return {status: true, auth: true, picId: phase.phase_PIC_id}
                        }
                    } else {
                        return {status: true, auth: true}
                    }
                }
            }

        } else {
            console.log(level, activity, level === "checklist")
            return {status: false, auth: false}
        }
    }
}

module.exports = accessController
