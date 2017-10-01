'use strict';
var jwt = require('jsonwebtoken');
var Sequelize = require('sequelize');
var Access = require('./accessController');
var moment = require('moment');
var config = require('../config'),
    db = require('../services/database'),
    Function = require('../models/function'),
    Phase = require('../models/phase'),
    Phasename = require('../models/phase_name'),
    Project = require('../models/project'),
    Module = require('../models/module'),
    Function= require('../models/function'),
    User = require('../models/user');

var FunctionController ={};

//api/function/add
FunctionController.addFunction =async function(req, res) {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("function", "add", null, token)
    // console.log(1)
    console.log(accessStatus)
    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    }else{
        if (!accessStatus.auth) {
            return res.status(403).json({status: false, message: "Unauthorized"})
        }
        else{
            if(!req.body.function_module_id||!req.body.function_name||!req.body.function_code) {
                return res.status(400).json({ status:false, message: 'Data Function Incomplete' });
            }
            else if(!req.body.phase_details) {
                return res.status(400).json({ status:false, message: 'Must Input Phase!' });
            }
            else{
                Phasename.findAll().then(function(checker) {
                    if(checker==0){
                        Phasename.bulkCreate(config.phaseName);
                    }
                }).catch(function(error) {
                    return res.status(500).json({ message: 'There was an error!' });
                });
                    var newFunction = {
                        function_module_id: req.body.function_module_id,
                        function_name: req.body.function_name,
                        function_code: req.body.function_code
                    };
                    var potensialdup = {
                        where: {
                            function_module_id:req.body.function_module_id,
                            function_code: req.body.function_code
                        }
                    };
                    Function.count(potensialdup).then(function(duplicate_checker){
                            if(duplicate_checker!=0){
                                return res.status(400).json({ status:false, message: 'Duplicate in function_code: '+req.body.function_code });
                            }
                            else{
                                Function.create(newFunction).then(function(createfunction) {
                                var fase = req.body.phase_details;
                                var func_id = createfunction;      
                                for (var i = 0, len = fase.length;i < len; i++) {
                                    var status      = req.body.phase_details[i].phase_status,
                                        status_date = req.body.phase_details[i].phase_status_date,
                                        start_date = moment(req.body.phase_details[i].phase_start_date),
                                        end_date = moment(req.body.phase_details[i].phase_end_date)
                                    if(!req.body.phase_details[i].phase_start_date||!req.body.phase_details[i].phase_end_date||!req.body.phase_details[i].phase_PIC_id||!req.body.phase_details[i].phase_status) {
                                        return Function.destroy({
                                                    where: {
                                                        function_id:createfunction.function_id
                                                    }
                                                })
                                                .then(function(deletefunction) {
                                                    if(deletefunction==1){
                                                        res.status(400).json({ message: 'Something Missing in Phase' });
                                                    }
                                                    else{
                                                        res.status(404).json({ message: 'ERROR' });
                                                    }
                                                }).catch(function(error) {
                                                    res.status(500).json({ message: 'There was an error in delete function!' });
                                                });
                                    }else if(req.body.phase_status_date&&(req.body.phase_status=="1"||req.body.phase_status=="2")){
                                        return Function.destroy({
                                                        where: {
                                                            function_id:createfunction.function_id
                                                        }
                                                    })
                                                    .then(function(deletefunctione) {
                                                        if(deletefunctione==1){
                                                            res.status(400).json({ message: 'Missing Date in Status Phase' });
                                                        }
                                                        else{
                                                            res.status(404).json({ message: 'ERROR' });
                                                        }
                                                    }).catch(function(error) {
                                                        res.status(500).json({ message: 'There was an error in delete function!' });
                                                    });
                                    }
                                    else if(end_date < start_date){
                                        return Function.destroy({
                                                        where: {
                                                            function_id:createfunction.function_id
                                                        }
                                                    })
                                                    .then(function(deletefunctione) {
                                                        if(deletefunctione==1){
                                                            res.status(400).json({ message: 'False Date in Phase' });
                                                        }
                                                        else{
                                                            res.status(404).json({ message: 'ERROR' });
                                                        }
                                                    }).catch(function(error) {
                                                        res.status(500).json({ message: 'There was an error in delete function!' });
                                                    }); 
                                    }
                                    if(status=="2"&&status_date){
                                        if(moment(status_date)<moment(start_date)){
                                            return Function.destroy({
                                                        where: {
                                                            function_id:createfunction.function_id
                                                        }
                                                    })
                                                    .then(function(deletefunctione) {
                                                        if(deletefunctione==1){
                                                            res.status(400).json({ message: 'Finished Date must be greater or equal than start date' });
                                                        }
                                                        else{
                                                            res.status(404).json({ message: 'ERROR' });
                                                        }
                                                    }).catch(function(error) {
                                                        res.status(500).json({ message: 'There was an error in delete function!' });
                                                    });
                                        }
                                        else if(moment(status_date)>moment()){
                                            return Function.destroy({
                                                        where: {
                                                            function_id:createfunction.function_id
                                                        }
                                                    })
                                                    .then(function(deletefunctione) {
                                                        if(deletefunctione==1){
                                                            res.status(400).json({ message: 'Finished Date must be smaller or equal than now' });
                                                        }
                                                        else{
                                                            res.status(404).json({ message: 'ERROR' });
                                                        }
                                                    }).catch(function(error) {
                                                        res.status(500).json({ message: 'There was an error in delete function!' });
                                                    });
                                        }
                                    }
                                    if(status=="3"&&status_date) {
                                        if(moment(status_date)<moment(start_date)){
                                            return Function.destroy({
                                                        where: {
                                                            function_id:createfunction.function_id
                                                        }
                                                    })
                                                    .then(function(deletefunctione) {
                                                        if(deletefunctione==1){
                                                            res.status(400).json({ message: 'Postponed Date must be greater or equal than start date' });
                                                        }
                                                        else{
                                                            res.status(404).json({ message: 'ERROR' });
                                                        }
                                                    }).catch(function(error) {
                                                        res.status(500).json({ message: 'There was an error in delete function!' });
                                                    });
                                        }
                                    }

                                var newPhase = {
                                    phase_phasename_id: req.body.phase_details[i].phase_phasename_id,
                                    phase_function_id: createfunction.function_id,
                                    phase_start_date: req.body.phase_details[i].phase_start_date,
                                    phase_end_date: req.body.phase_details[i].phase_end_date,
                                    phase_PIC_id: req.body.phase_details[i].phase_PIC_id,
                                    phase_note: req.body.phase_details[i].phase_note
                                };
                                

                                    Phase.create(newPhase).then(function(passing){
                                        var phase_id = passing.dataValues.phase_id
                                        FunctionController.passingdate(passing)
                                        if(status=="2"&&status_date){
                                                Phase.update(
                                                    {
                                                        phase_status_date:status_date,
                                                        phase_finished_flag:true,
                                                        phase_postponed_flag:false
                                                    },
                                                    {
                                                        where:{
                                                        phase_id:phase_id
                                                        }
                                                    }
                                                    )
                                                
                                        }else if(status=="3"&&status_date){
                                                Phase.update(
                                                    {
                                                        phase_status_date:status_date,
                                                        phase_finished_flag:false,
                                                        phase_postponed_flag:true
                                                    },
                                                    {
                                                        where:{
                                                        phase_id:phase_id
                                                        }
                                                    }
                                                    )
                                                
                                        }else if(status=="1"){
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
                                                    )
                                                })
                                        }

                                    });
                                    //THE END OF CREATE NEW PHASE
                                }
                                //THE END OF LOOPING
                                return res.status(200).json({ status:true , message: 'Function created!' });
                            });
                            }
                    })
                    .catch(function (err) {
                    // respond with validation errors
                        return res.status(400).json({ status:false , message: err.errors[0].message });
                    })
                .catch(function (err) {
                    return res.status(400).send({
                        message: err.message
                    });
                });
            }    
        }
        
        //end
    }
    
}

//api/function/edit
FunctionController.editfunctionDetails =async function(req, res) {
    var token = await req.headers.authorization

    if(!req.body.function_id|| !req.body.function_name|| !req.body.function_code) {
        res.status(404).json({ message: 'Missing Something' });
    }
    else {
        var function_id = req.body.function_id,
            function_name = req.body.function_name,
            function_code = req.body.function_code;
        var accessStatus = await Access.checkAuthentication("function", "edit", function_id, token)
        if (!accessStatus.status) {
                return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        }else {
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }else{
                Function.update({function_name: function_name,function_code:function_code},{where:{function_id:function_id}})
                .then(function(editfunction) {
                    if(editfunction==1){res.status(200).json({ message: 'Success Edit Function' })}
                    else{res.status(404).json({ message: 'Function ID not Found' })}
                }).catch(function(error) {res.status(500).json({ message: 'There was an error!' })})
            }
        }
    }
}

//api/function/delete
FunctionController.deleteFunction =async function(req, res) {
    var token = await req.headers.authorization

    if(!req.body.function_id) {
        res.status(404).json({ message: 'Missing Function ID' });
    }
    else {
        var function_id = req.body.function_id
        var accessStatus = await Access.checkAuthentication("function", "edit", function_id, token)
        if (!accessStatus.status) {
            return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
        }else{
            if (!accessStatus.auth) {
                return res.status(403).json({status: false, message: "Unauthorized"})
            }else{
                Function.findOne({
                where: {
                    function_id:function_id
                }
                }).then(function(p){Function.destroy({where:{function_id:function_id}})
                    .then(function(deletefunction){
                        if(deletefunction==1){
                            functionupdateDate(p)
                            res.status(200).json({ message: 'Success Delete Function' })
                        }
                        else{res.status(404).json({ message: 'Function ID not Found' })}
                    }).catch(function(error){res.status(500).json({ message: 'There was an error!'})})    
                })
            }
        }    
    }
}

//api/function
FunctionController.listFunction =async function(req, res) {
    var token = await req.headers.authorization
    var accessStatus = await Access.checkAuthentication("function", "get", null, token)
    console.log(accessStatus)
    if (!accessStatus.status) {
        return res.status(500).json({status: false, message: "Internal Server Error (Access)"})
    }else{
        if (!accessStatus.auth) {
            return res.status(403).json({status: false, message: "Unauthorized"})
        }else{
            Function.findAll({where:{function_id:{$in:accessStatus.functions_id}}})
            .then(function(listfunction) {
                res.status(200).json(listfunction);
            }).catch(function(error) {
                res.status(500).json({ message: 'There was an error!' });
            });
        }
    } 
}

//just passing
FunctionController.passingdate = function(passingphasefuncid){
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

function functionupdateDate(a){
                Function.min('function_start_date',{ 
                    where: 
                        { 
                            function_module_id:
                                { 
                                    $eq: a.function_module_id
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
                                            $eq: a.function_module_id
                                        }
                                }
                        }
                    ).then(function(){
                        Module.findOne({
                            where: 
                                {
                                    module_id: 
                                        {
                                            $eq: a.function_module_id
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

                Function.max('function_end_date',{ 
                    where: 
                        { 
                            function_module_id:
                                { 
                                    $eq: a.function_module_id
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
                                            $eq: a.function_module_id
                                        }
                                }
                        }
                    ).then(function(){
                        Module.findOne({
                            where: 
                                {
                                    module_id: 
                                        {
                                            $eq: a.function_module_id
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
}
module.exports = FunctionController;