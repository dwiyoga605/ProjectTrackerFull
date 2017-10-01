// The User model.
'use strict'; 

var Sequelize = require('sequelize'),
    bcrypt = require('bcrypt');

var config = require('../config'),
    db = require('../services/database');

// var Project = require('../models/project'),
//     Phase = require('../models/phase'),
//     Checklist = require('../models/checklist');


// 1: The model schema.
var modelDefinition = {
    id_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [5, 10],
            msg: 'Username must be between 5 and 10 characters in length'
          }
        }       
    },  
    employee_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: {
            args: [5, 20],
            msg: 'Employee_id must be between 5 and 10 characters in length'
          }
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [5, 50],
            msg: 'Name must be between 5 and 50 characters in length'
          }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.ENUM('1', '2', '3', '4'),
        allowNull: false,
        defaultValue: config.userRoles.PM
    },
    verified_status: {
        type: Sequelize.ENUM('accept', 'waiting', 'reject'),
        allowNull: false,
        defaultValue: config.userVerifiedstatus.waiting
    },
    activated_status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: config.userActivatedstatus.active
    }

};

// 2: The model options.
var modelOptions = {
    hooks: {
        beforeValidate: hashPassword
    }
};

// 3: Define the User model.
var UserModel = db.define('user_management', modelDefinition, modelOptions);

UserModel.prototype.comparePasswords = comparePasswords

UserModel.addHook('afterSync','syncUserModel', function(options) {
    // console.log("UserModel beforeSync")
    UserModel.count({where:{role:4}}).then(c => {
        if (c === 0) {
            var newUser = {
                username: 'admin',
                name: 'admin',
                role: 4,
                password: 'admin',
                employee_id: 'admin',
                verified_status: 'accept',
                activated_status: 'active'
            };
            UserModel.create(newUser)
        }
    })
})

// Compares two passwords.
function comparePasswords(password, callback) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        if(error) {
            return callback(error);
        }

        return callback(null, isMatch);
    });
}

// Hashes the password for a user object.
function hashPassword(user) {
    if(user.changed('password')) {
        return bcrypt.hash(user.password, 10).then(function(password) {
            user.password = password;
        });
    }
}

// Project.belongsTo(UserModel, {foreignKey:{name:'project_manager_id', allowNull:true}})
// Phase.belongsTo(UserModel, { foreignKey: {name:'phase_PIC_id', allowNull:true} })
// Checklist.belongsTo(UserModel, { foreignKey: {name:'checked_by_id', allowNull:true} })

module.exports = UserModel;