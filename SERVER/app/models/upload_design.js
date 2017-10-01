// The Module model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
var Phase = require('../models/phase'),
    User = require('../models/user');
    // Checklist = require('../models/checklist');

// 1: The model schema.
var modelDefinition = {
    design_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    design_uploaded_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    design_file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    design_accepted_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
};

// 2: Define the Module model.
var UploadDesignModel = db.define('upload_design', modelDefinition);

Phase.hasMany(UploadDesignModel, { foreignKey: {name:'design_phase_id', allowNull:true}, onDelete: 'cascade', hooks: true});
User.hasMany(UploadDesignModel, { foreignKey: {name:'design_uploaded_by', allowNull:true} });

UploadDesignModel.belongsTo(Phase, { foreignKey: {name:'design_phase_id', allowNull:true}, onDelete: 'cascade', hooks: true});
UploadDesignModel.belongsTo(User, { foreignKey: {name:'design_uploaded_by', allowNull:true} });

module.exports = UploadDesignModel;