// The Project model.
'use strict'; 

var Sequelize = require('sequelize');
var config = require('../config'),
    db = require('../services/database');
var User = require('../models/user');
    // Module = require('../models/module');


// 1: The model schema.
var modelDefinition = {
    project_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 50],
            msg: 'Project name must be between 2 and 50 characters in length'
          }
        }      
    },  
    project_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
    project_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    project_client_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 100],
            msg: 'Project Client Name must be between 2 and 100 characters in length'
          }
        }
    },
    project_client_address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [10, 200],
            msg: 'Project Client Address must be between 10 and 200 characters in length'
          }
        }
    },
    project_client_phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    project_client_email: {
        type: Sequelize.STRING,
        allowNull: { args: false, msg: 'Email is required.' },
        validate: { isEmail: { msg: 'Invalid email.' } }
    }
};

// 2: Define the Project model.
var ProjectModel = db.define('project', modelDefinition);
// one to many assosiation
User.hasMany(ProjectModel, { foreignKey: {name:'project_manager_id', allowNull:true} });

ProjectModel.belongsTo(User, { foreignKey: {name:'project_manager_id', allowNull:true} });
// Module.belongsTo(ProjectModel, { foreignKey: {name:'module_project_id', allowNull:true}, onDelete: 'cascade', hooks: true })

module.exports = ProjectModel;