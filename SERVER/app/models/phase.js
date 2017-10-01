// The Module model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
var Function = require('../models/function'),
    User = require('../models/user'),
    PhaseName = require('../models/phase_name');
    // Checklist = require('../models/checklist');

// 1: The model schema.
var modelDefinition = {
    phase_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phase_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    phase_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    phase_status_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    phase_finished_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    phase_postponed_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    phase_note: {
        type: Sequelize.TEXT,
        allowNull: true,
        len: [0,400]
    },
    progress_percentage:{
        type: Sequelize.INTEGER,
        allowNull: false,
        min: 0,
        max: 100,
        defaultValue: 0
    }
};

// 2: Define the Module model.
var PhaseModel = db.define('phase', modelDefinition);

Function.hasMany(PhaseModel, { foreignKey: {name:'phase_function_id', allowNull:true}, onDelete: 'cascade', hooks: true});
User.hasMany(PhaseModel, { foreignKey: {name:'phase_PIC_id', allowNull:true} });
PhaseName.hasMany(PhaseModel, { foreignKey: {name:'phase_phasename_id', allowNull:true} });

PhaseModel.belongsTo(Function, { foreignKey: {name:'phase_function_id', allowNull:true}, onDelete: 'cascade', hooks: true});
PhaseModel.belongsTo(User, { foreignKey: {name:'phase_PIC_id', allowNull:true} });
PhaseModel.belongsTo(PhaseName, { foreignKey: {name:'phase_phasename_id', allowNull:true} });

module.exports = PhaseModel;