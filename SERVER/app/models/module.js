// The Module model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
var Project = require('../models/project');
    // Function = require('../models/function');

// 1: The model schema.
var modelDefinition = {
    module_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    module_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 100],
            msg: 'Module Name must be between 2 and 100 characters in length'
          }
        }      
    },
    module_code_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 50],
            msg: 'Module Code must be between 2 and 50 characters in length'
          }
        }
    },
    module_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
    module_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
};

// 2: Define the Module model.
var ModuleModel = db.define('module', modelDefinition);

Project.hasMany(ModuleModel, { foreignKey: {name:'module_project_id', allowNull: true}, onDelete: 'cascade', hooks: true });

ModuleModel.belongsTo(Project, { foreignKey: {name:'module_project_id', allowNull: true}, onDelete: 'cascade', hooks: true });
// Function.belongsTo(ModuleModel, { foreignKey: {name:'function_module_id', allowNull:true}, onDelete: 'cascade', hooks: true })

module.exports = ModuleModel;