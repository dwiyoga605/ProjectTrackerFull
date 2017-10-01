// The Module model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
var Function = require('../models/function'),
    User = require('../models/user'),
    Phase = require('../models/phase'),
    PhaseName = require('../models/phase_name');

// 1: The model schema.
var modelDefinition = {
    historicalphase_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    historicalphase_input_date: { //date when the model was changed
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    historicalphase_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    historicalphase_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    historicalphase_status_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    historicalphase_finished_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    historicalphase_postponed_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    historicalphase_historical_kind: {
        type: Sequelize.ENUM('1','2'),
        allowNull: false
    },
    // historicalphase_note: {
    //     type: Sequelize.TEXT,
    //     allowNull: true,
    //     length: long
    // },
    historicalphase_progress_percentage:{
        type: Sequelize.INTEGER,
        allowNull: false,
        min: 0,
        max: 100,
        defaultValue: 0
    }
};

// 2: Define the Module model.
var HistoricalPhaseModel = db.define('historical_phase', modelDefinition);

User.hasMany(HistoricalPhaseModel, { foreignKey: {name:'historicalphase_PIC_id', allowNull:true} });
Phase.hasMany(HistoricalPhaseModel, { foreignKey: {name:'historicalphase_phase_id', allowNull:false} });

HistoricalPhaseModel.belongsTo(User, { foreignKey: {name:'historicalphase_PIC_id', allowNull:true} });
HistoricalPhaseModel.belongsTo(Phase, { foreignKey: {name:'historicalphase_phase_id', allowNull:false} });

module.exports = HistoricalPhaseModel;