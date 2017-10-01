'use strict';
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database'),
    User = require('../models/user');

var AdminController ={};
//api/admin/usermanagement
AdminController.userManagement = function(req, res) {
    var pageNumbers = req.body.page
    var filterSearch = req.body.filter_search;
    if(!pageNumbers) {
        return res.status(400).json({ message: 'Page was missing' });
    } 
    else{
        var whereRole = {}
        var whereName = {}
        var whereUsual = {}
        if(Object.keys(filterSearch).length!=0&&(filterSearch.role!=undefined||filterSearch.name!=undefined)){
            console.log("hahaha")
            if(filterSearch["role"]&&filterSearch["name"]){
                console.log("hoho")
                User.findAndCountAll({
                where: {
                    role: {
                        $eq : filterSearch["role"],
                        $ne : "4"
                    },
                    name: {
                        $like: '%' + filterSearch["name"]+ '%'
                    }
                },
                limit: 5,
                offset: (pageNumbers - 1)*5
                })
                .then(function(manage) {
                        return res.status(200).json(manage);
                    }).catch(function(error) {
                        console.log(error)
                        return res.status(500).json({ message: 'There was an error!' });
                    });
            }
            //Set select filter of 'role'
            else if(filterSearch["role"]){
                console.log("hihi")
                User.findAndCountAll({
                where: {
                    role: {
                        $eq : filterSearch["role"],
                        $ne : "4"
                    }
                },
                limit: 5,
                offset: (pageNumbers - 1)*5
                })
                .then(function(manage) {
                        return res.status(200).json(manage);
                    }).catch(function(error) {
                        console.log(error)
                        return res.status(500).json({ message: 'There was an error!' });
                    });
            }
            //Set select filter of 'name'
            else if(filterSearch["name"]){
                console.log("hehe")
                User.findAndCountAll({
                where: {
                    name: {
                        $like: '%' + filterSearch["name"]+ '%'
                    },
                    role:{
                        $ne: "4"
                    }
                },
                limit: 5,
                offset: (pageNumbers - 1)*5
                })
                .then(function(manage) {
                        return res.status(200).json(manage);
                    }).catch(function(error) {
                        console.log(error)
                        return res.status(500).json({ message: 'There was an error!' });
                    });
            }
        }else{
            console.log("hohoho")
            User.findAndCountAll({
            where: {
                    role:{
                        $ne: "4"
                    }
                },
            limit: 5,
            offset: (pageNumbers - 1)*5
            })
            .then(function(manage) {
                    return res.status(200).json(manage);
                }).catch(function(error) {
                    console.log(error)
                    return res.status(500).json({ message: 'There was an error!' });
                });
        }
        
        
    }
}

//api/admin/usermanagement/update
AdminController.edituserFast = function(req, res) {
    if(!req.body.id_user|| !req.body.role||!req.body.verified_status||!req.body.activated_status) {
        res.status(404).json({ message: 'Missing Something' });
    } 
    else if(req.body.role == "4"){
        res.status(404).json({ message: 'Ilegal Action'});
    }
    else {
        var id_user = req.body.id_user,
        	role = req.body.role,
        	verified_status= req.body.verified_status,
            activated_status = req.body.activated_status;

        User.update(
        	{role: role, verified_status: verified_status,activated_status: activated_status},
        	{
                where: {
                id_user:id_user,
                role:{
                    $ne: "4"
                }
            }})
        .then(function(edituserfast) {
        	if(edituserfast==1){
                res.status(200).json({ message: 'Success Edit User' });
            }
            else{
                res.status(404).json({ message: 'User ID not Found' });
            }
        }).catch(function(error) {
            res.status(500).json({ message: 'There was an error!' });
        });
    }
}

//api/admin/usermanagement/edit
AdminController.edituserDetails = function(req, res) {
    if(!req.body.id_user|| !req.body.role|| !req.body.name ||!req.body.verified_status||!req.body.activated_status) {
        res.status(404).json({ message: 'Missing Something' });
    } 
    else if(req.body.role == "4"){
        res.status(404).json({ message: 'Ilegal Action'});
    }
    else if(req.body.password.length<8){
        res.status(404).json({ message: 'Password Must be at least 8 Character'});
    }
    else {
        var id_user = req.body.id_user,
        	role = req.body.role,
        	password = req.body.password,
        	name = req.body.name,
            verified_status = req.body.verified_status,
            activated_status = req.body.activated_status;
        if(!req.body.password){
        User.update(
        	{
                name: name,
                role:role,
                verified_status:verified_status,
                activated_status:activated_status
            },
        	{
                where: {
                id_user:id_user,
                role:{
                    $ne: "4"
                }
            }})
        .then(function(edituserdetails1) {
            if(edituserdetails1==1){
                res.status(200).json({ message: 'Success Edit User' });
            }
            else{
                res.status(404).json({ message: 'User ID not Found' });
            }
        }).catch(function(error) {
            console.log(error);
            res.status(500).json({ message: 'There was an error!' });
        });
    }else{
        User.update(
            {
                name: name,
                role:role,
                password:password,
                verified_status:verified_status,
                activated_status:activated_status
            },
            {
                where: {
                id_user:id_user,
                role:{
                    $ne: "4"
                }
            }})
        .then(function(edituserdetails) {
            console.log("edit",edituserdetails)
            if(edituserdetails==1){
                res.status(200).json({ message: 'Success Edit User with password changed' });
            }
            else{
                res.status(404).json({ message: 'User ID not Found' });
            }
        }).catch(function(error) {
            console.log(error);
            res.status(500).json({ message: 'There was an error!' });
        });
    }
    }
}

//api/admin/usermanagement/delete
AdminController.deleteUser = function(req, res) {
    if(!req.body.id_user) {
        res.status(404).json({ message: 'Missing User ID' });
    }
    else {
        var id_user = req.body.id_user;

        User.destroy({
            where: {
                id_user:id_user,
                role:{
                    $ne: "4"
                }
            }
                })
        .then(function(deleteuser) {
            if(deleteuser==1){
                res.status(200).json({ message: 'Success Delete User' });
            }
            else{
                res.status(404).json({ message: 'User ID not Found' });
            }
        }).catch(function(error) {
            console.log(error);
            res.status(500).json({ message: 'There was an error!' });
        });
    }
}
module.exports = AdminController;