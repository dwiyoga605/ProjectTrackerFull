// The Module model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
var Phase = require('../models/phase'),
    User = require('../models/user');
var ChecklistMigration = require('../migrations/checklistMigrations');

// 1: The model schema.
var modelDefinition = {
    checklist_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    checklist_text: {
        type: Sequelize.STRING,
        allowNull: false
      },
    checklist_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
};

// 2: Define the Module model.
var ChecklistModel = db.define('checklist', modelDefinition);

// ChecklistModel.beforeSync = function(options) {
//     console.log("beforeSync")
// }

ChecklistModel.addHook('beforeSync', 'try', (options) => {
    console.log("beforeSync")
    // ChecklistMigration.up()
})

Phase.hasMany(ChecklistModel, { foreignKey: {name:'checklist_phase_id', allowNull:false} });
User.hasMany(ChecklistModel,{ foreignKey: {name:'checked_by_id', allowNull:true} });

ChecklistModel.belongsTo(Phase,{ foreignKey: {name:'checklist_phase_id', allowNull:false} });
ChecklistModel.belongsTo(User,{ foreignKey: {name:'checked_by_id', allowNull:true} });
 
module.exports = ChecklistModel;