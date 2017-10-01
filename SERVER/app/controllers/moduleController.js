'use strict';
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var Access = require('./accessController');
var config = require('../config'),
    db = require('../services/database'),
    Module = require('../models/module'),
    Project = require('../models/project');

var ModuleController ={};

//api/module/add
ModuleController.addModule =async function(req, res) {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("module", "add", null, token)
    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    }else{
        if (!accessStatus.auth) {
            return res.status(403).json({status: false, message: "Unauthorized"})
        }else{
            if(!req.body.module_code_name||!req.body.module_name||!req.body.module_project_id) {
                res.status(400).json({ status:false, message: 'Data Incomplete' });
            }else {
                db.sync().then(function() {
                    var newModule = {
                        module_project_id: req.body.module_project_id,
                        module_name: req.body.module_name,
                        module_code_name: req.body.module_code_name
                    };
                    var potensialdup = {
                        where: {
                            module_project_id: req.body.module_project_id,
                            module_code_name: req.body.module_code_name
                        }
                    };
                    Module.count(potensialdup).then(function(duplicate_checker){
                            if(duplicate_checker!=0){
                                return res.status(400).json({ status:false, message: 'Duplicate in function_code: '+ req.body.module_code_name });
                            }
                            else{
                                return Module.create(newModule).then(function() {
                                    res.status(201).json({ status:true , message: 'Module created!' });
                                })
                                .catch(function (err) {return res.status(422).json({ status:false , message: err.errors[0].message})})
                            }
                        }).catch(function (err) {return res.status(404).send({message: "Not Found!"})})      
                })
                .catch(function (err) {return res.status(500).send({message: "Internal Server Error (Add Module)"})})
            }
        }
    }
    
}

//api/module/edit
ModuleController.editmoduleDetails =async function(req, res) {
    var token = await req.headers.authorization

    if(!req.body.module_id|| !req.body.module_name|| !req.body.module_code_name) {
        res.status(404).json({ message: 'Missing Something' });
    }
    else { 
        var module_id = req.body.module_id,
            module_name = req.body.module_name,
            module_code_name = req.body.module_code_name;

        var accessStatus = await Access.checkAuthentication("module", "edit", module_id, token)
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        } else{
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }else{
                Module.update(
                    {
                        module_name: module_name,
                        module_code_name:module_code_name
                    },
                    {
                        where: {
                        module_id:module_id
                    }})
                .then(function(editmodule) {
                    if(editmodule==1){
                        res.status(200).json({ message: 'Success Edit Module' })
                    }
                    else{
                        res.status(404).json({ message: 'Module ID not Found' })
                    }
                })
                .catch(function (err) {return res.status(422).json({ status:false , message: err.errors[0].message})})
                .catch(function (err) {return res.status(500).send({message: "Internal Server Error (Edit Module)"})})
            }
        }
    }
}

//api/module/delete
ModuleController.deleteModule =async function(req, res) {
    var token = await req.headers.authorization

    if(!req.body.module_id) {
        res.status(404).json({ message: 'Missing Module ID' })
    }
    else {
        var module_id = req.body.module_id
        var accessStatus = await Access.checkAuthentication("module", "edit", module_id, token)
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        }else{
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }else{
                Module.findOne({
                    where: {
                        module_id:module_id
                    }
                }).then(function(a){
                    Module.destroy({
                        where:{
                            module_id:module_id
                        }
                    }).then(function(deletemodule) {
                        if(deletemodule==1){
                            moduleupdateDate(a)
                            res.status(200).json({ message: 'Success Delete Module' })
                        }
                        else{ return res.status(404).json({ message: 'Module ID not Found' }) }
                    }).catch(function (err) {return res.status(500).send({message: "Internal Server Error (Delete Module)"})}) 
                }).catch(function (err) {return res.status(500).send({message: "Internal Server Error (Find one Delete Module)"})})
            }
        }  
    }
}

//api/module
ModuleController.listModule =async function(req, res) {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("module", "get", null, token)
    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    }else{
        if (!accessStatus.auth) {
            return res.status(403).json({status: false, message: "Unauthorized"})
        }else{
            Module.findAll({where:{module_id: {$in:accessStatus.modules_id}}})
            .then(function(listmodule) {res.status(200).json(listmodule)})
            .catch(function (err) {return res.status(500).send({message: "Internal Server Error (List Module)"})})
        }
    }
}

function moduleupdateDate(a){
    Module.min('module_start_date',{ 
        where: 
            { 
                module_project_id:
                    { 
                        $eq: a.module_project_id
                    } 
            } 
    }).then(function(minimalmodule){
        Project.update(
            {
                project_start_date:minimalmodule
            },
            {
                where:
                    {
                        project_id:
                            {
                                $eq: a.module_project_id
                            }
                    }
            }
        )
    })

    Module.max('module_end_date',{ 
        where: 
            { 
                module_project_id:
                    { 
                        $eq: a.module_project_id
                    } 
            } 
    }).then(function(maximalmodule){
        Project.update(
            {
                project_end_date:maximalmodule
            },
            {
                where:
                    {
                        project_id:
                            {
                                $eq: a.module_project_id
                            }
                    }
            }
        )
    })
}
module.exports = ModuleController;