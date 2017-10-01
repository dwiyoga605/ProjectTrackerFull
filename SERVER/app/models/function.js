// The Module model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
var Module = require('../models/module');
    // Phase = require('../models/phase');

// 1: The model schema.
var modelDefinition = {
    function_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    function_name: {
        type: Sequelize.STRING,
        allowNull: false,
        len: [1,50]      
    },
    function_code: {
        type: Sequelize.STRING,
        allowNull: false,
        len: [1,50]      
    },
    function_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
    function_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
    }
};

// 2: Define the Module model.
var FunctionModel = db.define('function', modelDefinition);

Module.hasMany(FunctionModel, { foreignKey: {name:'function_module_id', allowNull:true}, onDelete: 'cascade', hooks: true });
FunctionModel.belongsTo(Module, { foreignKey: {name:'function_module_id', allowNull:true}, onDelete: 'cascade', hooks: true });
// Phase.belongsTo(FunctionModel, { foreignKey: {name:'phase_function_id', allowNull:true}, onDelete: 'cascade', hooks: true})

module.exports = FunctionModel;