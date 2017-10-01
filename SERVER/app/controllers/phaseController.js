'use strict';
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var Access = require('./accessController');
var moment = require('moment');
var FunctionController = require('./functionController');
var config = require('../config'),
    db = require('../services/database'),
    Phasename = require('../models/phase_name'),
    Phase = require('../models/phase'),
    User = require('../models/user'),
    moment = require('moment'),
    Function= require('../models/function'),
    Module= require('../models/module'),
    Project= require('../models/project'),
    HistoricalPhase= require('../models/historical_phase');

var PhaseController ={};

//api/phase/add
PhaseController.addPhasename = function(req, res) {
    var phasename_name = req.body.phasename_name.toLowerCase()
    if(!phasename_name) { //require phasename_name
        return res.status(400).json({ status:false, message: 'Data Incomplete' }); //response
        }
     else {
            var newPhasename = { //Collect All variable into just one variable
                phasename_name: phasename_name 
            };
            Phasename.findOne(
            {
                where: {
                    phasename_name: {
                        $eq: phasename_name
                    }
                }
            }).then(function(b){
                if(b==null){
                    return Phasename.create(newPhasename).then(function(success) {
                res.status(201).json({ status:true , phase_phasename_id:success.phasename_id, message: 'Phasename created and Added!' });
            });
                }
                else{
                    return res.status(201).json({ status:true , phase_phasename_id:b.phasename_id, message: 'Phasename Added!' });
                }
            })
            .catch(function (err) {
            console.log(err);
            // respond with validation errors
            return res.status(422).json({ status:false , message: "Something Wrong" });
        })
        .catch(function (err) {
            // every other error
            return res.status(400).send({
                message: err.message
            });
            });
    }
}

//api/phase/update
PhaseController.updatePhase =async function(req, res) {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("phase", "add", null, token) 
    var phasename_name = req.body.phasename_name.toLowerCase()
    var function_id = req.body.function_id,
        phase_start_date = req.body.phase_start_date,
        phase_end_date = req.body.phase_end_date,
        phase_status_date = req.body.phase_status_date,
        phase_status = req.body.phase_status,
        phase_note = req.body.phase_note,
        phase_PIC_id=req.body.phase_PIC_id;

    var status      = req.body.phase_status,
        status_date = req.body.phase_status_date,
        start_date = moment(req.body.phase_start_date),
        end_date = moment(req.body.phase_end_date);
    if(!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    }else{
        if (!accessStatus.auth) {
            return res.status(403).json({status: false, message: "Unauthorized"})
        }else{
            if(!req.body.function_id||!req.body.phase_start_date||!req.body.phase_end_date||!req.body.phase_PIC_id||!req.body.phase_status||!req.body.phasename_name) {
                return res.status(400).json({ status:false, message: 'Data Incomplete' });        
            }
            else if(!req.body.phase_status_date&&(req.body.phase_status=="2"||req.body.phase_status=="3")){
                return res.status(400).json({ status:false, message: 'Must input status date' });
            }
            else if(end_date < start_date){
                return res.status(400).json({ message: 'False Date in Phase' });
            }
            else {
                if(status=="2"&&status_date){
                    if(moment(status_date)<moment(start_date)){
                        return res.status(400).json({ message: 'Finished Date must be greater or equal than start date' });
                    }
                    else if(moment(status_date)>moment()){
                        return res.status(400).json({ message: 'Finished Date must be smaller or equal than now' })
                    }
                }
                if(status=="3"&&status_date) {
                    if(moment(status_date)<moment(start_date)){
                        return res.status(400).json({ message: 'Postponed Date must be greater or equal than start date' });
                    }
                }
                    var newPhasename = { //Collect All variable into just one variable
                        phasename_name: phasename_name 
                    };
                    
                    Phasename.findOne(
                    {
                        where: {
                            phasename_name: req.body.phasename_name
                        }
                    }).then(function(b){
                        if(b==null){
                            Phasename.create(newPhasename).then(function(success) {
                                var newPhase = { //Collect All variable into just one variable
                                    phase_start_date: phase_start_date,
                                    phase_end_date: phase_end_date,
                                    phase_note: phase_note,
                                    phase_PIC_id: phase_PIC_id,
                                    phase_function_id: function_id,
                                    phase_phasename_id: success.phasename_id 
                                }
                                Phase.create(newPhase).then(function(passing){
                                var phase_id = passing.dataValues.phase_id
                                FunctionController.passingdate(passing)
                                if(status=="2"&&status_date){
                                    Phase.update({phase_status_date:status_date,phase_finished_flag:true,phase_postponed_flag:false},{where:{phase_id:phase_id}})
                                    .then(function(){
                                        return res.status(201).json({ status:true , phase_phasename_id:success.phasename_id, message: 'Phase Successfully Added!' })
                                    })
                                    .catch(function(err){
                                        console.log(err)
                                        return res.status(400).json({ status:false , message: err.errors })
                                    })
                                }else if(status=="3"&&status_date){
                                    Phase.update({phase_status_date:status_date,phase_finished_flag:false,phase_postponed_flag:true},{where:{phase_id:phase_id}})
                                    .then(function(){
                                        return res.status(201).json({ status:true , phase_phasename_id:success.phasename_id, message: 'Phase Successfully Added!' });
                                    })
                                    .catch(function(err){
                                        console.log(err)
                                        return res.status(400).json({ status:false , message: err.errors })
                                    })
                                }else{
                                    Phase.update({phase_status_date:null,phase_finished_flag:false,phase_postponed_flag:false},{where:{phase_id:phase_id}})
                                    .then(function(){Phase.update({phase_status_date:null,phase_finished_flag:false,phase_postponed_flag:false},{where:{phase_id:phase_id}})
                                    .then(function(){return res.status(201).json({ status:true , phase_phasename_id:success.phasename_id, message: 'Phase Successfully Added!'})})
                                    }).catch(function(err){
                                            return res.status(400).json({ status:false , message: err.errors })
                                    })
                                }}).catch(function(err){
                                    console.log(err)
                                        return res.status(400).json({ status:false , message: err.errors })
                                    })
                            }).catch(function(err){
                                    return res.status(400).json({ status:false , message: err.errors })
                            })
                        }
                        else{
                            var newPhase = { //Collect All variable into just one variable
                                    phase_start_date: phase_start_date,
                                    phase_end_date: phase_end_date,
                                    phase_note: phase_note,
                                    phase_PIC_id: phase_PIC_id,
                                    phase_function_id: function_id,
                                    phase_phasename_id: b.phasename_id 
                                }
                                Phase.findOne({
                                    where:{
                                        phase_function_id:function_id,
                                        phase_phasename_id:b.phasename_id
                                    }
                                }).then(function(cek_dup){
                                    if(cek_dup==null){
                                        Phase.create(newPhase)
                                        .then(function(passing){
                                        var phase_id = passing.dataValues.phase_id
                                        FunctionController.passingdate(passing)
                                        if(status=="2"&&status_date){
                                            Phase.update({phase_status_date:status_date,phase_finished_flag:true,phase_postponed_flag:false},{where:{phase_id:phase_id}})
                                            .then(function(){
                                                return res.status(201).json({ status:true , phase_phasename_id:b.phasename_id, message: 'Phasename Added!' });
                                            })
                                        }else if(status=="3"&&status_date){
                                            Phase.update({phase_status_date:status_date,phase_finished_flag:false,phase_postponed_flag:true},{where:{phase_id:phase_id}})
                                            .then(function(){
                                                return res.status(201).json({ status:true , phase_phasename_id:b.phasename_id, message: 'Phasename Added!' });
                                            })
                                        }else{
                                            Phase.update({phase_status_date:null,phase_finished_flag:false,phase_postponed_flag:false},{where:{phase_id:phase_id}})
                                            .then(function(){Phase.update({phase_status_date:null,phase_finished_flag:false,phase_postponed_flag:false},{where:{phase_id:phase_id}})
                                                .then(function(){
                                                    return res.status(201).json({ status:true , phase_phasename_id:b.phasename_id, message: 'Phasename Added!' });
                                                })})
                                        }
                                        })
                                    }else{
                                        return res.status(400).json({ status:false, message: req.body.phasename_name+' has been used as phasename in this function' });
                                    }
                                })    
                        }
                    }).catch(function (err) {
                    // respond with validation errors
                    return res.status(422).json({ status:false , message: "Something Wrong" });
                })
                .catch(function (err) {
                    // every other error
                    return res.status(400).send({
                        message: err.message
                    });
                    });
            }
        }
    }
    
}

//api/phase/edit
PhaseController.editphaseDetails =async function(req, res) {
    var token = await req.headers.authorization
    var start_date  = moment(req.body.phase_start_date),
        end_date    = moment(req.body.phase_end_date),
        phase_id = req.body.phase_id,
        phase_start_date = req.body.phase_start_date,
        phase_end_date = req.body.phase_end_date,
        phase_PIC_id = req.body.phase_PIC_id,
        phase_note = req.body.phase_note;

    if(!req.body.phase_id|| !req.body.phase_start_date|| !req.body.phase_end_date||!req.body.phase_PIC_id||!req.body.phase_status) {
        console.log(req.body.phase_status);
        return res.status(400).json({ message: 'Missing Something' });
    }
    else if(!req.body.phase_status_date&&(req.body.phase_status=="1"||req.body.phase_status=="2")){
        return res.status(400).json({ message: 'Missing Date in Status Phase' });
    }
    else if(end_date < start_date){
        return res.status(400).json({ message: 'End Date must be more than equal Start Date' });
    }
    else {
        var accessStatus = await Access.checkAuthentication("phase", "edit", phase_id, token)
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        }else{
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }else{
                Phase.findOne({
                    where:{
                        phase_id : phase_id
                    }
                }).then(function(passingphasefuncid){
                        Phase.update(
                            {
                                phase_start_date: phase_start_date,
                                phase_end_date:phase_end_date,
                                phase_PIC_id:phase_PIC_id,
                                phase_note: phase_note
                            },
                            {
                                where: {
                                    phase_id:phase_id
                            }})
                        .then(function(editphase) {
                            var beforeupdatePIC= passingphasefuncid.dataValues.phase_PIC_id
                            var beforeupdateStatus_finish= passingphasefuncid.dataValues.phase_finished_flag
                            var beforeupdateStatus_postpone= passingphasefuncid.dataValues.phase_postponed_flag
                            Phase.findOne({
                                where:{
                                    phase_id:phase_id
                                }
                            }).then(function(changechecker){
                                /*console.log("ceker",changechecker)*/
                                var afterupdatePIC= changechecker.dataValues.phase_PIC_id
                                var changedPIC = false
                                    if(afterupdatePIC!=beforeupdatePIC){
                                        changedPIC=true
                                    }
                                        if(editphase==1){
                                            Phase.findOne({
                                                where:{
                                                    phase_id:phase_id
                                                }
                                            }).then(function(history){
                                                //only take date for update in historical phase
                                                var updatedat_dateonly=moment(passingphasefuncid.dataValues.updatedAt).format('YYYY-MM-DD')
                                                if(changedPIC){
                                                    var historicalphase_historical_kind = 1
                                                    HistoricalPhase.create({
                                                        historicalphase_input_date: updatedat_dateonly,
                                                        historicalphase_start_date: passingphasefuncid.dataValues.phase_start_date,
                                                        historicalphase_end_date : passingphasefuncid.dataValues.phase_end_date,
                                                        historicalphase_status_date : passingphasefuncid.dataValues.phase_status_date,
                                                        historicalphase_finished_flag : beforeupdateStatus_finish,
                                                        historicalphase_postponed_flag : beforeupdateStatus_postpone,
                                                        historicalphase_historical_kind : historicalphase_historical_kind,
                                                        historicalphase_progress_percentage : passingphasefuncid.dataValues.progress_percentage,
                                                        historicalphase_PIC_id : passingphasefuncid.dataValues.phase_PIC_id,
                                                        historicalphase_phase_id : passingphasefuncid.dataValues.phase_id
                                                    }).then(function(hantu){
                                                        
                                                    })
                                                }
                                            if(req.body.phase_status=="1"&&req.body.phase_status_date){
                                                if(moment(req.body.phase_status_date)<moment(req.body.phase_start_date)){
                                                    return res.status(404).json({ message: 'Finished Date must be greater or equal than start date' });
                                                }
                                                else if(moment(req.body.phase_status_date)>moment()){
                                                    return res.status(404).json({ message: 'Finished Date must be smaller or equal than now' });
                                                }else{
                                                Phase.update(
                                                    {
                                                        phase_status_date:req.body.phase_status_date,
                                                        phase_finished_flag:true,
                                                        phase_postponed_flag:false
                                                    },
                                                    {
                                                        where:{
                                                        phase_id:phase_id
                                                        }
                                                    }
                                                ).then(function(){
                                                    Phase.findOne({
                                                        where:{
                                                            phase_id:phase_id
                                                        }
                                                    }).then(function(status){
                                                        var afterupdateStatus_finish=status.dataValues.phase_finished_flag
                                                        var afterupdateStatus_postpone=status.dataValues.phase_postponed_flag

                                                        if((afterupdateStatus_finish!=beforeupdateStatus_finish)||
                                                                (afterupdateStatus_postpone!=beforeupdateStatus_postpone)){
                                                                PhaseController.passingdate(passingphasefuncid);
                                                                var historicalphase_historical_kind = 2
                                                                HistoricalPhase.create({
                                                                    historicalphase_input_date: updatedat_dateonly,
                                                                    historicalphase_start_date: passingphasefuncid.dataValues.phase_start_date,
                                                                    historicalphase_end_date : passingphasefuncid.dataValues.phase_end_date,
                                                                    historicalphase_status_date : passingphasefuncid.dataValues.phase_status_date,
                                                                    historicalphase_finished_flag : beforeupdateStatus_finish,
                                                                    historicalphase_postponed_flag : beforeupdateStatus_postpone,
                                                                    historicalphase_historical_kind : historicalphase_historical_kind,
                                                                    historicalphase_progress_percentage : passingphasefuncid.dataValues.progress_percentage,
                                                                    historicalphase_PIC_id : passingphasefuncid.dataValues.phase_PIC_id,
                                                                    historicalphase_phase_id : passingphasefuncid.dataValues.phase_id
                                                                }).then(function(){
                                                                    console.log("SUDAH NYAMPE STATUS")
                                                                    return res.status(200).json({ message: 'Success Edit Phase' });
                                                                })
                                                    }
                                                    })  
                                                })
                                            }
                                            }
                                            else if(req.body.phase_status=="2"&&req.body.phase_status_date){
                                                if(moment(req.body.phase_status_date)<moment(req.body.phase_start_date)){
                                                    return res.status(404).json({ message: '-Postponed Date must be greater or equal than start date' });
                                                }else{
                                                Phase.update(
                                                    {
                                                        phase_status_date:req.body.phase_status_date,
                                                        phase_finished_flag:false,
                                                        phase_postponed_flag:true
                                                    },
                                                    {
                                                        where:{
                                                        phase_id:phase_id
                                                        }
                                                    }
                                                ).then(function(){
                                                    Phase.findOne({
                                                        where:{
                                                            phase_id:phase_id
                                                        }
                                                    }).then(function(status){
                                                        var afterupdateStatus_finish=status.dataValues.phase_finished_flag
                                                        var afterupdateStatus_postpone=status.dataValues.phase_postponed_flag

                                                        if((afterupdateStatus_finish!=beforeupdateStatus_finish)||
                                                                (afterupdateStatus_postpone!=beforeupdateStatus_postpone)){
                                                                PhaseController.passingdate(passingphasefuncid);
                                                                var historicalphase_historical_kind = 2
                                                                HistoricalPhase.create({
                                                                    historicalphase_input_date: updatedat_dateonly,
                                                                    historicalphase_start_date: passingphasefuncid.dataValues.phase_start_date,
                                                                    historicalphase_end_date : passingphasefuncid.dataValues.phase_end_date,
                                                                    historicalphase_status_date : passingphasefuncid.dataValues.phase_status_date,
                                                                    historicalphase_finished_flag : beforeupdateStatus_finish,
                                                                    historicalphase_postponed_flag : beforeupdateStatus_postpone,
                                                                    historicalphase_historical_kind : historicalphase_historical_kind,
                                                                    historicalphase_progress_percentage : passingphasefuncid.dataValues.progress_percentage,
                                                                    historicalphase_PIC_id : passingphasefuncid.dataValues.phase_PIC_id,
                                                                    historicalphase_phase_id : passingphasefuncid.dataValues.phase_id
                                                                }).then(function(){
                                                                    console.log("SUDAH NYAMPE STATUS")
                                                                    return res.status(200).json({ message: 'Success Edit Phase' });
                                                                })
                                                    }else{
                                                        return res.status(200).json({ message: 'Success Edit Phase' });
                                                    }
                                                    })  
                                                })
                                                }
                                            }
                                            else if(req.body.phase_status=="0"){
                                                Phase.update(
                                                    {   
                                                        phase_status_date:null,
                                                        phase_finished_flag:false,
                                                        phase_postponed_flag:false
                                                    },
                                                    {
                                                        where:{
                                                            phase_id:phase_id
                                                        }
                                                    }
                                                ).then(function(){
                                                    Phase.update(
                                                    {
                                                        phase_status_date:null,
                                                        phase_finished_flag:false,
                                                        phase_postponed_flag:false
                                                    },
                                                    {
                                                        where:{
                                                        phase_id:phase_id
                                                        }
                                                    }
                                                ).then(function(){
                                                    Phase.findOne({where:{phase_id:phase_id}})
                                                    .then(function(status){
                                                        var afterupdateStatus_finish=status.dataValues.phase_finished_flag
                                                        var afterupdateStatus_postpone=status.dataValues.phase_postponed_flag

                                                        if((afterupdateStatus_finish!=beforeupdateStatus_finish)||
                                                                (afterupdateStatus_postpone!=beforeupdateStatus_postpone)){
                                                                PhaseController.passingdate(passingphasefuncid);
                                                                var historicalphase_historical_kind = 2
                                                                HistoricalPhase.create({
                                                                    historicalphase_input_date: updatedat_dateonly,
                                                                    historicalphase_start_date: passingphasefuncid.dataValues.phase_start_date,
                                                                    historicalphase_end_date : passingphasefuncid.dataValues.phase_end_date,
                                                                    historicalphase_status_date : passingphasefuncid.dataValues.phase_status_date,
                                                                    historicalphase_finished_flag : beforeupdateStatus_finish,
                                                                    historicalphase_postponed_flag : beforeupdateStatus_postpone,
                                                                    historicalphase_historical_kind : historicalphase_historical_kind,
                                                                    historicalphase_progress_percentage : passingphasefuncid.dataValues.progress_percentage,
                                                                    historicalphase_PIC_id : passingphasefuncid.dataValues.phase_PIC_id,
                                                                    historicalphase_phase_id : passingphasefuncid.dataValues.phase_id
                                                                }).then(function(){
                                                                    console.log("SUDAH NYAMPE STATUS")
                                                                    return res.status(200).json({ message: 'Success Edit Phase' });
                                                                })
                                                    }else{
                                                        return res.status(200).json({ message: 'Success Edit Phase' });
                                                    }
                                                    })  
                                                })
                                            })
                                            }
                                            })                      
                                        }
                                        else{return res.status(404).json({ message: 'Phase ID not Found'})}
                            })    
                        }).catch(function(error) {return res.status(500).json({ message: 'There was an error!' })})
                })
            }
        }
        
    }
}
//api/phase/delete
PhaseController.deletePhase =async function(req, res) {
    var token = await req.headers.authorization
    if(!req.body.phase_id) {
        return res.status(404).json({ message: 'Missing Phase ID' });
    }
    else {
        var phase_id = req.body.phase_id
        var accessStatus = await Access.checkAuthentication("phase", "edit", phase_id, token)
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        }else{
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }else{
                Phase.findOne({where: {phase_id:phase_id}})
                .then(function(passingid){
                    Phase.destroy({where: {phase_id:phase_id}})
                    .then(function(deletephase) {
                        if(deletephase==1){
                            FunctionController.passingdate(passingid)
                            res.status(200).json({ message: 'Success Delete Phase' })
                        }
                        else{
                            return res.status(404).json({ message: 'Phase ID not Found' })
                        }
                    }).catch(function(error) {
                        console.log(error);
                        return res.status(500).json({ message: 'There was an error!' })
                    })
                })
            }
        }  
    }
}
//api/phase/pic
PhaseController.listPersonincharge = function(req, res) {
        User.findAll({
        where: {
            $or: [{role: "2"}, {role: "3"}],
        verified_status: {
            $ne: "waiting"
        },
        activated_status: {
            $ne: "inactive"
        }
    }
    })
    .then(function(listpersonincharge) {
            return res.status(200).json(listpersonincharge);
        }).catch(function(error) {
            return res.status(500).json({ message: 'There was an error!' });
        });
}

//api/phase
PhaseController.listPhase =async function(req, res) {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("phase", "get", null, token)
    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    }else{
        if (!accessStatus.auth) {
            return res.status(403).json({status: false, message: "Unauthorized"})
        }else{
            Phase.findAll({where:{phase_id:{$in:accessStatus.phases_id}}})
            .then(function(listphase){return res.status(200).json(listphase)})
            .catch(function(error) {return res.status(500).json({ message: 'There was an error!' })})
        }
    }
    
}

//api/phasename
PhaseController.listPhasename = function(req, res) {
    Phasename.findAll()
    .then(function(listphasename) {
            return res.status(200).json(listphasename);
        }).catch(function(error) {
            return res.status(500).json({ message: 'There was an error!' });
        });
}

//just passing
PhaseController.passingdate = function(passingphasefuncid){
    var phase_function_id = passingphasefuncid.phase_function_id;
    //START DATE FROM PHASE TO PROJECT
    Phase.min('phase_start_date',{ 
        where: 
            { 
                phase_function_id:
                    { 
                        $eq: phase_function_id 
                    } 
            } 
    }).then(function(minimalphase){
        Function.update(
            {
                function_start_date:minimalphase
            },
            {
                where:
                    {
                        function_id:
                            {
                                $eq: phase_function_id
                            }
                    }
            }
        ).then(function(){
            Function.findOne({
                where: 
                    {
                        function_id: 
                            {
                                $eq: phase_function_id
                            }
                    }
            }).then(function(passing_function_module_id){
                Function.min('function_start_date',{ 
                    where: 
                        { 
                            function_module_id:
                                { 
                                    $eq: passing_function_module_id.function_module_id
                                } 
                        } 
                }).then(function(minimalfunction){
                    Module.update(
                        {
                            module_start_date:minimalfunction
                        },
                        {
                            where:
                                {
                                    module_id:
                                        {
                                            $eq: passing_function_module_id.function_module_id
                                        }
                                }
                        }
                    ).then(function(){
                        Module.findOne({
                                where: 
                                    {
                                        module_id: 
                                            {
                                                $eq: passing_function_module_id.function_module_id
                                            }
                                    }
                        }).then(function(passing_module_project_id){
                            Module.min('module_start_date',{ 
                                    where: 
                                        { 
                                            module_project_id:
                                                { 
                                                    $eq: passing_module_project_id.module_project_id
                                                } 
                                        } 
                            }).then(function(minimalmodule){
                                Project.update(
                                    {
                                        project_start_date:minimalmodule
                                    },
                                    {
                                        where:
                                            {
                                                project_id:
                                                    {
                                                        $eq: passing_module_project_id.module_project_id
                                                    }
                                            }
                                    }
                                )
                            })
                        })
                    })
                })
            })
        })
    });
    //THE END OF START DATE PASSING

    //END DATE FROM PHASE TO PROJECT
    Phase.max('phase_end_date',{ 
        where: 
            { 
                phase_function_id:
                    { 
                        $eq: phase_function_id 
                    } 
            } 
    }).then(function(maximalphase){
        Function.update(
            {
                function_end_date:maximalphase
            },
            {
                where:
                    {
                        function_id:
                            {
                                $eq: phase_function_id
                            }
                    }
            }
        ).then(function(){
            Function.findOne({
                where: 
                    {
                        function_id: 
                            {
                                $eq: phase_function_id
                            }
                    }
            }).then(function(passing_function_module_id){
                Function.max('function_end_date',{ 
                    where: 
                        { 
                            function_module_id:
                                { 
                                    $eq: passing_function_module_id.function_module_id
                                } 
                        } 
                }).then(function(maximalfunction){
                    Module.update(
                        {
                            module_end_date:maximalfunction
                        },
                        {
                            where:
                                {
                                    module_id:
                                        {
                                            $eq: passing_function_module_id.function_module_id
                                        }
                                }
                        }
                    ).then(function(){
                        Module.findOne({
                                where: 
                                    {
                                        module_id: 
                                            {
                                                $eq: passing_function_module_id.function_module_id
                                            }
                                    }
                        }).then(function(passing_module_project_id){
                            Module.max('module_end_date',{ 
                                    where: 
                                        { 
                                            module_project_id:
                                                { 
                                                    $eq: passing_module_project_id.module_project_id
                                                } 
                                        } 
                            }).then(function(maximalmodule){
                                Project.update(
                                    {
                                        project_end_date:maximalmodule
                                    },
                                    {
                                        where:
                                            {
                                                project_id:
                                                    {
                                                        $eq: passing_module_project_id.module_project_id
                                                    }
                                            }
                                    }
                                )
                            })
                        })
                    })
                })
            })
        })
    });
    //THE END OF END DATE PASSING   
}

module.exports = PhaseController;