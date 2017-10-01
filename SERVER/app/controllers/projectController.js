'use strict';
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var Access = require('./accessController');
var config = require('../config'),
    db = require('../services/database'),
    Project = require('../models/project');

var ProjectController ={};

//api/project/add
ProjectController.addProject =async function(req, res) {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("project", "add", null, token)
    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    }else{
        if (!accessStatus.auth) {
            return res.status(403).json({status: false, message: "Unauthorized"})
        }else{
            if(!req.body.project_manager_id||!req.body.project_name||!req.body.project_client_name||!req.body.project_client_address||!req.body.project_client_phone||!req.body.project_client_email) {
                res.status(400).json({ status:false, message: 'Data Incomplete' })
            }
             else {
                db.sync().then(function() {
                    var newProject = {
                        project_name: req.body.project_name,
                        project_client_name: req.body.project_client_name,
                        project_client_address: req.body.project_client_address,
                        project_client_phone: req.body.project_client_phone,
                        project_client_email: req.body.project_client_email,
                        project_manager_id: req.body.project_manager_id
                    }
                    return Project.create(newProject).then(function() {res.status(201).json({ status:true , message: 'Project created!'})})
                    .catch(function (err) {return res.status(422).json({ status:false , message: err.errors[0].message})})
                })
                .catch(function (err) {return res.status(500).send({message: "Internal Server Error (Add Project)"})})
            }
        }
    } 
}

//api/project/edit
ProjectController.editprojectDetails =async function(req, res) {
    var token = await req.headers.authorization
    if(!req.body.project_id|| !req.body.project_name|| !req.body.project_client_name ||!req.body.project_client_address||!req.body.project_client_phone||!req.body.project_client_email||!project_manager_id) {
        res.status(404).json({ message: 'Missing Something' });
    }
    else {
        var project_id = req.body.project_id,
            project_name = req.body.project_name,
            project_client_name = req.body.project_client_name,
            project_client_address = req.body.project_client_address,
            project_client_phone = req.body.project_client_phone,
            project_client_email = req.body.project_client_email,
            project_manager_id = req.body.project_manager_id;
        var accessStatus = await Access.checkAuthentication("project", "edit", project_id, token)
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        }else{
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }else{
                Project.update(
                    {
                        project_name: project_name,
                        project_client_name:project_client_name,
                        project_client_address:project_client_address,
                        project_client_phone:project_client_phone,
                        project_client_email:project_client_email,
                        project_manager_id:project_manager_id
                    },
                    {
                        where:{
                            project_id:project_id
                        }
                    }
                )
            .then(function(editproject) {
                if(editproject==1){res.status(200).json({ message: 'Success Edit Project' })}
                else{res.status(404).json({ message: 'Project ID not Found' })}
            })
            .catch(function (err) {return res.status(422).json({ status:false , message: err.errors[0].message})})
            .catch(function (err) {return res.status(500).json({status: false, message: "Internal Server Error (Edit Project)"})})
            }
        }
    }
}

//api/project/delete
ProjectController.deleteProject =async function(req, res) {
    var token = await req.headers.authorization
    if(!req.body.project_id) {
        res.status(404).json({ message: 'Missing Project ID' });
    }
    else {
        var project_id = req.body.project_id;
        var accessStatus = await Access.checkAuthentication("project", "edit", project_id, token)
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        }else{
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }else{
                Project.destroy({where:{project_id:project_id}})
                .then(function(deleteproject) {
                    if(deleteproject==1){res.status(200).json({ message: 'Success Delete Project' })}
                    else{res.status(404).json({ message: 'Project ID not Found' })}
                })
                .catch(function(error){res.status(500).json({ message: 'There was an error!' })})
            }
        }  
    }
}

//api/project
ProjectController.listProject =async function(req, res) {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("project", "get", null, token)
    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    }else{
        if (!accessStatus.auth) {
            return res.status(404).json({status: false, message: "No Project Found"})
        }else{
            Project.findAll({
                where:{project_id:{$in:accessStatus.projects_id}}
            })
            .then(function(listproject){res.status(200).json(listproject)})
            .catch(function(error){console.log(error);res.status(500).json({ message: 'There was an error!' })})
        }
    }
}
module.exports = ProjectController;