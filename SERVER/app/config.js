// Application configuration.
'use strict';

var config = module.exports;

config.db = {
    user: '', 
    password: '',
    name: 'sakura'
};

config.db.details = {
    host: 'sql12.freemysqlhosting.net',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5000,
        min: 0,
        idle: 30
    }
};

config.keys = {
    secret: 'iv3fordd&pjlt%(op-ym+a&x$i0x(o3o17qjoj@3pb=znvckww' // Not anymore...
};

var historicalStatus = config.historicalStatus = {
    changePIC          :1,
    changeStatus       :2
}

var dayStatus = config.dayStatus = {
    workday         :1,
    off             :2,
    planned         :3
};

var phaseStatus = config.phaseStatus = {
    unknown         :1,
    finsihed        :2,
    postponed       :3
};

config.phaseName = 
[
    { phasename_id: 1,phasename_name: "Design" },
    { phasename_id: 2,phasename_name: "Coding" },
    { phasename_id: 3,phasename_name: "Testing"}
];

var userVerifiedstatus = config.userVerifiedstatus = {
    accept : 'accept', 
    waiting: 'waiting'
};

var userRoles = config.userRoles = {
    PM: 1,    
    SA: 2,
    PG: 3,    
    admin: 4
};

var userActivatedstatus = config.userActivatedstatus = {
    active  : 'active',    
    inactive: 'inactive'
};

config.accessLevels = {
    PM: userRoles.PM | userRoles.admin,
    user: userRoles.PM | userRoles.SA | userRoles.PG | userRoles.admin,
    SA: userRoles.SA | userRoles.PM | userRoles.admin,
    PG: userRoles.PG | userRoles.PM | userRoles.admin,
    admin: userRoles.admin
};
