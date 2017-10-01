// The Module model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
var User = require('../models/user'),
    Project = require('../models/project');
    // Checklist = require('../models/checklist');

// 1: The model schema.
var modelDefinition = {
    projectupload_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    projectupload_uploaded_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    projectupload_file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
};

// 2: Define the Module model.
var UploadProjectModel = db.define('upload_project', modelDefinition);

User.hasMany(UploadProjectModel, { foreignKey: {name:'projectupload_uploaded_by', allowNull: false}, onDelete: 'cascade', hooks: true});
Project.hasOne(UploadProjectModel, { foreignKey: {name:'projectupload_project_id', allowNull: false, unique: true}, onDelete: 'cascade', hooks: true});

UploadProjectModel.belongsTo(User, { foreignKey: {name:'projectupload_uploaded_by', allowNull:false}, onDelete: 'cascade', hooks: true});
UploadProjectModel.belongsTo(Project, { foreignKey: {name:'projectupload_project_id', allowNull: false, unique: true}, onDelete: 'cascade', hooks: true});

module.exports = UploadProjectModel;