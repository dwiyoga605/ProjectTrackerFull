'use strict';

var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database'),
    User = require('../models/user'),
    Phasename = require('../models/phase_name');

// The authentication controller.
var AuthController = {};

//api/signup
AuthController.signUp = function(req, res) {
    if(!req.body.username||!req.body.password||!req.body.employee_id||!req.body.name) {
        res.status(400).json({ status:false, message: 'Data Incomplete' });
        }
    else if(req.body.role == "4"){
        res.status(404).json({ message: 'Ilegal Action'});
    }
    else if(req.body.password.length<8){
        res.status(404).json({ message: 'Password Must be at least 8 Character'});
    }
     else {
        db.sync({hooks: true}).then(function() {
            var newUser = {
                username: req.body.username,
                name: req.body.name,
                role: req.body.role,
                password: req.body.password,
                employee_id: req.body.employee_id
            };

            return User.create(newUser).then(function() {
                res.status(201).json({ status:true , message: 'Account created!' });
            });
        }).catch(function (err) {
            // respond with validation errors
            return res.status(422).json({ status:false , message: err.errors[0].message });
        })
        .catch(function (err) {
            // every other error
            return res.status(400).send({
                message: err.message
            });
            });
    }
}

//api/authenticate
AuthController.authenticateUser = function(req, res) {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({ message: 'username and password are needed!' });
    } else {
        db.sync({hooks: true}).then(function() {
        var username = req.body.username,
            password = req.body.password,
            potentialUser = { where: { username: username, verified_status: 'accept' } };

        User.findOne(potentialUser).then(function(user) {
            if(!user) {
                res.status(404).json({ status: false, message: 'Authentication failed!' });
            } else {
                user.comparePasswords(password, function(error, isMatch) {
                    if(isMatch && !error) {
                        var token = jwt.sign(
                            {   
                                id_user: user.id_user,
                                username: user.username
                             },
                            config.keys.secret,
                            { expiresIn: '30000m' }
                        );

                        res.status(200).json({
                            status: true,
                            token: 'JWT ' + token,
                            name: user.name,
                            role: user.role
                        });
                    } else {
                        res.status(404).json({ message: 'Login failed!' });
                    }
                });
            }
        }).catch(function(error) {
            res.status(500).json({ message: 'There was an error!' });
        });
    }).catch(function (err) {
            // respond with validation errors
            return res.status(422).json({ status:false , message: err.errors });
        })
        .catch(function (err) {
            // every other error
            return res.status(400).send({
                message: err.message
            });
            });
    }
}

module.exports = AuthController;