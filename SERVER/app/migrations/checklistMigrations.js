'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        console.log("Up")
        queryInterface.describeTable('Person').then(attributes => {
            console.log(attributes)
        }).catch(err => {
            console.log("Err Migration")
        })
    }
}