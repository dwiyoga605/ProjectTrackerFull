// The Module model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
// var Phase = require('../models/phase');

// 1: The model schema.
var modelDefinition = {
    phasename_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    },
    phasename_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        len: [1,50]  
    }
};

// 2: Define the Module model.
var PhasenameModel = db.define('phase_name', modelDefinition);

// Phase.belongsTo(PhasenameModel, { foreignKey: {name:'phase_phasename_id', allowNull:true} })

module.exports = PhasenameModel;