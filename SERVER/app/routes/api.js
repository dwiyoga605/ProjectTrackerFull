'use strict';

var router = require('express').Router();
var multer = require('multer');
var defConst = require('../const/defaultConst');
var config = require('../config'),
    allowOnly = require('../services/routesHelper').allowOnly,
    AuthController = require('../controllers/authController'),
    UserController = require('../controllers/userController'),
    AdminController = require('../controllers/adminController'),
    ProjectController = require('../controllers/projectController'),
    ModuleController = require('../controllers/moduleController'),
    FunctionController = require('../controllers/functionController'),
    PhaseController = require('../controllers/phaseController'),
    ChecklistController = require('../controllers/checklistController'),
    DashboardController = require('../controllers/dashboardController'),
    CalendarController = require('../controllers/calendarController'),
    UploadController = require('../controllers/uploadController');

var APIRoutes = function(passport) {
    //Usual Things.
    router.post('/signup', AuthController.signUp);
    router.post('/authenticate', AuthController.authenticateUser);

    //Admin Routers
    router.post('/admin/usermanagement/update', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.edituserFast));
    router.post('/admin/usermanagement/edit', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.edituserDetails));
    router.post('/admin/usermanagement/delete', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.deleteUser));
    router.post('/admin/usermanagement', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.admin, AdminController.userManagement));

    //Project Routers
    router.post('/project/add', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, ProjectController.addProject));
    router.post('/project/edit', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, ProjectController.editprojectDetails));
    router.post('/project/delete', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, ProjectController.deleteProject));
    router.get('/project', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, ProjectController.listProject));
    router.post('/project/upload', passport.authenticate('jwt', { session: false }), multer({
            storage: multer.diskStorage({
                destination: defConst.uploadProject,
                limits: {fileSize: 1000000, files: 1}
            })
        }).single('project_file'), allowOnly(config.accessLevels.PM, UploadController.uploadProject));    

    //Module Routers
    router.post('/module/add', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, ModuleController.addModule));
    router.post('/module/edit', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, ModuleController.editmoduleDetails));
    router.post('/module/delete', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, ModuleController.deleteModule));
    router.get('/module', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, ModuleController.listModule));

    //Function Routers
    router.post('/function/add', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, FunctionController.addFunction));
    router.post('/function/edit', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, FunctionController.editfunctionDetails));
    router.post('/function/delete', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, FunctionController.deleteFunction));
    router.get('/function', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, FunctionController.listFunction));

    //Phase Routers
    router.post('/phase/add', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, PhaseController.addPhasename));
    router.post('/phase/edit', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, PhaseController.editphaseDetails));
    router.post('/phase/delete', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, PhaseController.deletePhase));
    router.post('/phase/update', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, PhaseController.updatePhase));
    router.get('/phase', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, PhaseController.listPhase));
    router.get('/phasename', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.user, PhaseController.listPhasename));
    router.get('/phase/pic', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, PhaseController.listPersonincharge));
    router.post('/design/upload', passport.authenticate('jwt', { session: false }), multer({
        storage: multer.diskStorage({
            destination: defConst.uploadDesign,
            limits: {fileSize: 1000000, files: 1}
        })
    }).single('design_file'), allowOnly(config.accessLevels.PM, UploadController.uploadDesign));

    //Checklist Routers
    router.post('/checklist/add', passport.authenticate('jwt', { session: false }), allowOnly(config.accessLevels.PM, ChecklistController.addChecklist));
    router.post('/checklist/edit', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, ChecklistController.editChecklist));
    router.post('/checklist/checked', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, ChecklistController.checkedChecklist));
    router.post('/checklist/unchecked', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, ChecklistController.uncheckedChecklist));
    router.post('/checklist/getbyid', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, ChecklistController.getChecklistsByPhaseId));

    //Dashboard Routers
    router.post('/dashboard/get', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, DashboardController.createDashboardData));

    //Calendar Routers
    router.post('/calendar/add', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, CalendarController.addDateCustom));
    router.post('/customdate/add', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, CalendarController.addDateCustom));    
    router.get('/customdate/get', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, CalendarController.getCustomDate));    
    router.post('/customdate/delete', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, CalendarController.deleteCustomDate));    
    router.post('/customdate/clear', passport.authenticate('jwt',{session: false}), allowOnly(config.accessLevels.user, CalendarController.clearCustomDate));    

    return router;
};

module.exports = APIRoutes;