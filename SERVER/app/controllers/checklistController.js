'use strict';

var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database'),
    Checklist = require('../models/checklist'),
    Phase = require('../models/phase');
var Access = require('./accessController');
var UsefulProgram = require('../programs/usefulProgram');

var ChecklistController = {};

//api/checklist/add
ChecklistController.addChecklist = async (req, res) => {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("checklist", "add", null, token)

    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    } else {
        if (!accessStatus.auth) {
            return res.status(403).json({status: false, message: "Unauthorized"})
        } else {
            if(!req.body.checklist_text || !req.body.checklist_phase_id) {
                return res.status(400).json({status: false, message: "Data Incomplete!"})
            } else {
                try {
                    await Checklist.sync({hooks: true})
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Sync)"})
                }
    
                try {
                    var transChecklist = await db.transaction()
                } catch(e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Transaction)"})
                }
                
                try {
                    var newChecklist = {
                        checklist_phase_id: req.body.checklist_phase_id,
                        checklist_status: false,
                        checklist_text: req.body.checklist_text
                    };

                    var phaseId = req.body.checklist_phase_id
                    // console.log(3)
                    await Checklist.create(newChecklist,{transaction: transChecklist})

                    var checklistCount = await Checklist.count({where: {checklist_phase_id: phaseId}})
                    var checklistCheckedCount = await Checklist.count({where: {$and: [{checklist_phase_id: phaseId},{checklist_status: 1}]}})
                } catch (e) {
                    await transChecklist.rollback()
                    return res.status(500).json({status: false, message: "Internal Server Error (Checklist Add)"})
                }

                try {
                    var percentageNew = await Math.floor(checklistCheckedCount / (checklistCount + 1) * 100)

                    var updatePercentage = await Phase.update({progress_percentage: percentageNew}, {where: {phase_id: phaseId}, transaction: transChecklist, silent: true})
                    await transChecklist.commit()

                    return res.status(201).json({status: false, message: "Checklist Successfully Added"})
                } catch (e) {
                    await transChecklist.rollback()
                    return res.status(500).json({status: false, message: "Internal Server Error (Phase)"})
                }
                
            }
        }
    }
}

//api/checklist/edit
ChecklistController.editChecklist = async function(req, res) {
    var token = await req.headers.authorization

    if (!req.body.checklist_id || (req.body.checklist_id || !req.body.checklist_id) || !req.body.checked_by_id) {
        return res.status(400).json({status: false, message: "Wrong Request"})
    } else {
        return Checklist.sync({hooks: true}).then(async () => {
            var checklist = req.body
            var checklist_id = checklist.checklist_id
            var accessStatus = await Access.checkAuthentication("checklist", "edit", checklist_id, token)
            if (!accessStatus.status) {
                return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
            } else {
                if (!accessStatus.auth) {
                    return res.status(403).json({status: false, message: "Unauthorized"})
                } else {
                    delete checklist.checklist_id
                    return Checklist.update(checklist,{where:{checklist_id: checklist_id}})
                                    .then(() => {
                                        return res.status(200).json({status: true, message: "Checklist Successfully Edited"})
                                    })
                                    .catch(err => {
                                        return res.status(400).json({status: false, message: "No Checklist Found"})
                                    })
                                    .catch(err => {
                                        return res.status(500).json({status: false, message: "Something Wrong!"})
                                    })
                }
            }
        }).catch(err => {
            return res.status(500).json({status: false, message: "Something Wrong!"})
        })
    }
}

//api/checklist/getbyid
ChecklistController.getChecklistsByPhaseId = async (req, res) => {
    if (!req.body.phase_id) {
        return res.status(400).json({status: false, message: "Wrong Request!"})
    } else {
        var phaseId = await req.body.phase_id
        var token = await req.headers.authorization
        var accessStatus = await Access.checkAuthentication("checklist", "get", phaseId, token)
    
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        } else {
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            } else {
                var checklistIds = await accessStatus.checklists_id
                try {
                    await Checklist.sync({hooks: true})
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Sync)"})
                }
    
                try {
                    var phaseId = await req.body.phase_id
                    //var checklists = await Checklist.findAll({where: {checklist_id: {$and: [{$in: checklistIds},{checklist_phase_id: phaseId}]}}})
                    var checklists = await Checklist.findAll({where: {checklist_id: {$in: checklistIds},checklist_phase_id: phaseId}})
                    // var checklistCheckedSum = await Checklist.count({where: {checklist_id: {$and: [{$in: checklistIds},{checklist_phase_id: phaseId},{checklist_status: 1}]}}})
                    // var checklistPercentage = await (Math.floor(checklistCheckedSum/checklists.length)*100).toString() + '%'
                    return res.status(201).json({checklists})
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Checklist)"})
                }
            }
        }
    }
}

//api/checklist/checked
ChecklistController.checkedChecklist = async (req, res) => {
    var token = await req.headers.authorization

    if (!req.body.checklist_id) {
        return res.status(400).json({status: false, message: "Wrong Request Format"})
    } else {
        var checklistId = req.body.checklist_id
        var accessStatus = await Access.checkAuthentication("checklist", "checked", checklistId, token)

        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        } else {
            if (accessStatus.auth) {
                var decodedToken = await UsefulProgram.decodeToken(token)
                var userId = decodedToken.id_user

                try {
                    var checklistSum = await Checklist.count()
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Checklist)!"})
                }

                if (checklistSum <= 0) {
                    return res.status(400).json({status: false, message: "No Any Checklist Found"})
                }

                try {
                    var checklistCheck = await Checklist.count({where: {$and: [{checklist_id: checklistId},{checklist_status: 1}]}})
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Check)"})
                }
        
                if (checklistCheck > 0) {
                    return res.status(400).json({status: false, message: "Checklist Have Been Checked"})
                } else {
                    try {
                        console.log(0)
                        var transChecklist = await db.transaction()
                        var phaseIds = []
                        console.log(1)
                        try {
                            var checkChecklist = await Checklist.update({checklist_status: true, checked_by_id: userId}, {where: {checklist_id: checklistId}, transaction: transChecklist})
                            console.log(2)
                            var phaseId = await Checklist.findOne({attributes: ['checklist_phase_id'], where: {checklist_id: checklistId}})
                            console.log(3)
                            phaseId = await phaseId.dataValues.checklist_phase_id
                            console.log(4)
                            var checklistCount = await Checklist.count({where: {checklist_phase_id: phaseId}})
                            console.log(5)
                            var checklistCheckedCount = await Checklist.count({where: {$and: [{checklist_phase_id: phaseId},{checklist_status: 1}]}})
                            console.log(6)

                            console.log("calculate=", checklistCheckedCount, checklistCount)

                            var percentageNew = await Math.floor((checklistCheckedCount + 1) / checklistCount * 100)
                            console.log(7)
        
                            try {
                                var updatePercentage = await Phase.update({progress_percentage: percentageNew}, {where: {phase_id: phaseId}, transaction: transChecklist, silent: true})
                            } catch (e) {
                                await transChecklist.rollback()
                                return res.status(500).json({status: false, message: "Internal Server Error (Update %)"})
                            }
                        } catch (e) {
                            await transChecklist.rollback()
                            return res.status(500).json({status: false, message: "Internal Server Error (Update)"})
                        }                        
                        await transChecklist.commit()
                        return res.status(201).json({status: true, message: "Checklists Successfully Checked"})
                    } catch (e) {
                        return res.status(500).json({status: false, message: "Internal Server Error (Transaction)"})
                    }
                }
            } else {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }
        }
    }
}

//api/checklist/unchecked
ChecklistController.uncheckedChecklist = async function(req, res) {
    var token = await req.headers.authorization

    if (!req.body.checklist_id) {
        return res.status(400).json({status: false, message: "Wrong Request Format"})
    } else {
        var checklistId = req.body.checklist_id
        var accessStatus = await Access.checkAuthentication("checklist", "checked", checklistId, token)

        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        } else {
            if (accessStatus.auth) {
                try {
                    var checklistSum = await Checklist.count()
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Checklist)!"})
                }

                if (checklistSum <= 0) {
                    return res.status(400).json({status: false, message: "No Any Checklist Found"})
                }

                try {
                    var checklistCheck = await Checklist.count({where: {$and: [{checklist_id: checklistId}, {checklist_status: 0}]}})
                } catch (e) {
                    return res.status(500).json({status: false, message: "Internal Server Error (Check)"})
                }
        
                if (checklistCheck > 0) {
                    return res.status(400).json({status: false, message: "Checklist Have Been Unchecked"})
                } else {
                    try {
                        console.log(0)
                        var transChecklist = await db.transaction()
                        var phaseIds = []
                        console.log(1)
                        try {
                            var checkChecklist = await Checklist.update({checklist_status: false, checked_by_id: null}, {where: {checklist_id: checklistId}, transaction: transChecklist})
                            console.log(2)
                            var phaseId = await Checklist.findOne({attributes: ['checklist_phase_id'], where: {checklist_id: checklistId}})
                            console.log(3)
                            phaseId = await phaseId.dataValues.checklist_phase_id
                            console.log(4)
                            var checklistCount = await Checklist.count({where: {checklist_phase_id: phaseId}})
                            console.log(5)
                            var checklistCheckedCount = await Checklist.count({where: {$and: [{checklist_phase_id: phaseId},{checklist_status: 1}]}})
                            console.log(6)

                            console.log("calculate=", checklistCheckedCount, checklistCount)

                            var percentageNew = await Math.floor((checklistCheckedCount - 1) / checklistCount * 100)
                            console.log(7)
        
                            try {
                                var updatePercentage = await Phase.update({progress_percentage: percentageNew}, {where: {phase_id: phaseId}, transaction: transChecklist, silent: true})
                            } catch (e) {
                                await transChecklist.rollback()
                                return res.status(500).json({status: false, message: "Internal Server Error (Update %)"})
                            }
                        } catch (e) {
                            await transChecklist.rollback()
                            return res.status(500).json({status: false, message: "Internal Server Error (Update)"})
                        }                        
                        await transChecklist.commit()
                        return res.status(201).json({status: true, message: "Checklists Successfully Unchecked"})
                    } catch (e) {
                        return res.status(500).json({status: false, message: "Internal Server Error (Transaction)"})
                    }
                }
            } else {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }
        }
    }
}

module.exports = ChecklistController;