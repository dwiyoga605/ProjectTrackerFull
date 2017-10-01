'use strict';

var Sequelize = require('sequelize');
var db = require('../services/database');

var modelDefinition = {
    custom_date_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    custom_date_note: {
        type: Sequelize.STRING,
        allowNull: true,
        len: [1,50]      
    },
    custom_date_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        unique: true
    },
    custom_date_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
};

var CustomDateModel = db.define('custom_date', modelDefinition);

module.exports = CustomDateModel;