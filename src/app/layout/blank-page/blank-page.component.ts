import { DashboardService } from './../dashboard.service';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { Component, ViewEncapsulation, Input, Output, ChangeDetectorRef, PipeTransform, Pipe } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import {NgProgressService} from 'ngx-progressbar';
import 'rxjs/add/operator/map';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { FileUploader } from 'ng2-file-upload';
declare var swal: any;

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./blank-page.component.scss']
})

@Pipe({name: 'keys'})
export class BlankPageComponent implements PipeTransform {

    transform(value, args:string[]) : any {
        let keys = [];
        for (let key in value) {
          keys.push({key: key, value: value[key]});
        }
        return keys;
      }

    ROLE;
    selectedRow: Number;
    closeResult: string;
    userName: string;
    selectedItem: any;
    filteredPhase = [];
    filteredPhaseWithName = [];
    modalReference: NgbModalRef;
    page = 1;
    margin = 0;
    countPage;
    isSearchRole = false;
    isSearchName = false;
    searchName;
    searchRole;

    functionNameSearch = false;;
    moduleNameSearch = false;
    picSearch = false;
    phaseNameSearch = false;
    projectGlobalName;

    GENERAL_END_POINT = 'https://ayam.localtunnel.me/api/admin/usermanagement/1';
    DELETE_END_POINT = 'https://ayam.localtunnel.me/api/admin/usermanagement/delete';
    APPROVE_REJECT_END_POINT = 'https://ayam.localtunnel.me/api/admin/usermanagement/update';
    EDIT_USER_END_POINT = 'https://ayam.localtunnel.me/api/admin/usermanagement/edit';
    PROJECT_DATA_END_POINT = 'https://ayam.localtunnel.me/api/project';
    GET_PHASE_LIST = 'https://ayam.localtunnel.me/api/phase';
    GET_LIST_FUNCTION = 'https://ayam.localtunnel.me/api/function';
    GET_LIST_PHASE_NAME = 'https://ayam.localtunnel.me/api/phasename';
    GET_LIST_PG_SA = 'https://ayam.localtunnel.me/api/phase/pic';
    //related to specific id project
    GET_MODULE_LIST = 'https://ayam.localtunnel.me/api/module';
    DELETE_FUNCTION = 'https://ayam.localtunnel.me/api/function/delete';
    DELETE_PHASE = 'https://ayam.localtunnel.me/api/phase/delete';
    UPDATE_MODULE = 'https://ayam.localtunnel.me/api/module/edit';
    UPDATE_FUNCTION = 'https://ayam.localtunnel.me/api/function/edit';
    UPDATE_PROJECT = 'https://ayam.localtunnel.me/api/project/edit';
    DASHBOARD_POST = 'https://ayam.localtunnel.me/api/dashboard/get';
    USERMANAGEMENT_SEARCH = 'https://ayam.localtunnel.me/api/admin/usermanagement';

    // add authorization header with jwt token
    headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
    options = new RequestOptions({ headers: this.headers });

    //PHASE EDIT MODAL START
    phase_status: any;
    list_PG_SA: any;
    phaseID_editPhase: any;
    tmpDateStart;
    tmpDateEnd;
    startCurrentDate;
    endCurrentDate;
    statusPhaseDefault;
    flag1 = true;
    flag1Value;
    _editPhasePICID;
    currentModuleName;
    currentModuleCode;
    currentFuncName;
    currentFuncCode;
    public isCollapsed = true;
    currentProjectID;
    dataTableExists = true;
    buttonString = "Edit Project";

    loop = ["Master", "Shifu", "Jhon"];

    //PHASE EDIT MODAL END

    _FUNCTION_ID;
    phaseEditList: any;

    data = {
        "id_user": ""
    };

    dataAcc = {
        "id_user": "",
        "role": "",
        "verified_status": "accept",
        "activated_status": ""
    };

    dataRej = {
        "id_user": "",
        "role": "",
        "verified_status": "reject",
        "activated_status": ""
    };

    dataEdit = {
        "id_user": "",
        "role": "",
        "password": "",
        "activated_status": "",
        "verified_status": "",
        "name": ""
    };

    //pass if password == null (edit user form)
    dataEdit2 = {
        "id_user": "",
        "role": "",
        "activated_status": "",
        "verified_status": "",
        "name": ""
    };

    //MODAL EDIT MODULE START
    moduleList = [];
    funcListByModuleID:any = [];
    phaseStatus = [
        {"name":"In Progress", "no":1},
        {"name":"Finished", "no":2},
        {"name":"Pending", "no":3},
        {"name":"Overdue", "no":4},
        {"name":"Early", "no":5},
        {"name":"Sick/Permit", "no":6},
        {"name":"Noticed Overdue", "no":7},
        {"name":"Finished Plan", "no":8},
        {"name":"Finished Overdue",  "no":9}
    ];
    //MODAL EDIT MODULE END
    response: any;
    response2: any = [];

    //CATATAN PENTING : DATATABLE HARUS URUT BERDASARKAN WAKTU, EX [{DATA JANUARI},{DATA FEBRUARI},{DATA MARET}]
/*     dataTable = [
        {
            "moduleID":"1",
            "module":"Module Administrasi",
            "code":"FA",
            "funcID":"99",
            "funcName":"Function Pembayaran",
            "PPIC":"",
            "APIC":"Dwi Yoga Wibawa",
            "DDS":"",
            "devStatus":"",
            "phaseID":"1",
            "Phase":"Finished Early",
            "checkList":[
                {
                    "month":9,
                    "year":2017,
                    "data":[
                        {"tgl":"1","status":"OP"},
                        {"tgl":"2","status":"PL"},
                        {"tgl":"3","status":"FE"},
                        {"tgl":"4","status":"FE"},
                        {"tgl":"5","status":"FE"},
                        {"tgl":"6","status":"PL"},
                        {"tgl":"7","status":"PL"},
                        {"tgl":"8","status":"PL"},
                        {"tgl":"9","status":"PL"},
                        {"tgl":"10","status":"PL"},
                        {"tgl":"11","status":"PL"},
                        {"tgl":"12","status":"PL"},
                        {"tgl":"13","status":"PL"},
                        {"tgl":"14","status":"PL"},
                        {"tgl":"15","status":"OD"},
                        {"tgl":"16","status":"PL"},
                        {"tgl":"17","status":"PL"},
                        {"tgl":"18","status":"PL"},
                        {"tgl":"19","status":"PL"},
                        {"tgl":"20","status":"PL"},
                        {"tgl":"21","status":"PL"},
                        {"tgl":"22","status":"PL"},
                        {"tgl":"23","status":"PL"},
                        {"tgl":"24","status":"PL"},
                        {"tgl":"25","status":"PL"},
                        {"tgl":"26","status":"PL"},
                        {"tgl":"27","status":"PL"},
                        {"tgl":"28","status":"PL"},
                        {"tgl":"29","status":"PL"},
                        {"tgl":"30","status":"PL"},
                        {"tgl":"31","status":"PL"}
                    ]
                },
                {
                    "month":10,
                    "year":2017,
                    "data":[
                        {"tgl":"1","status":"PL"},
                        {"tgl":"2","status":"PL"},
                        {"tgl":"3","status":"PL"},
                        {"tgl":"4","status":"PL"},
                        {"tgl":"5","status":"PL"},
                        {"tgl":"6","status":"PL"},
                        {"tgl":"7","status":"PL"},
                        {"tgl":"8","status":"PL"},
                        {"tgl":"9","status":"PL"},
                        {"tgl":"10","status":"PL"},
                        {"tgl":"11","status":"PL"},
                        {"tgl":"12","status":"PL"},
                        {"tgl":"13","status":"PL"},
                        {"tgl":"14","status":"PL"},
                        {"tgl":"15","status":"PL"},
                        {"tgl":"16","status":"PL"},
                        {"tgl":"17","status":"PL"},
                        {"tgl":"18","status":"PL"},
                        {"tgl":"19","status":"PL"},
                        {"tgl":"20","status":"PL"},
                        {"tgl":"21","status":"PL"},
                        {"tgl":"22","status":"PL"},
                        {"tgl":"23","status":"PL"},
                        {"tgl":"24","status":"PL"},
                        {"tgl":"25","status":"PL"},
                        {"tgl":"26","status":"PL"},
                        {"tgl":"27","status":"PL"},
                        {"tgl":"28","status":"PL"},
                        {"tgl":"29","status":"PL"},
                        {"tgl":"30","status":"PL"},
                    ]
                },
                {
                    "month":11,
                    "year":2017,
                    "data":[
                        {"tgl":"1","status":"PL"},
                        {"tgl":"2","status":"PL"},
                        {"tgl":"3","status":"PL"},
                        {"tgl":"4","status":"PL"},
                        {"tgl":"5","status":"PL"},
                        {"tgl":"6","status":"PL"},
                        {"tgl":"7","status":"PL"},
                        {"tgl":"8","status":"PL"},
                        {"tgl":"9","status":"PL"},
                        {"tgl":"10","status":"PL"},
                        {"tgl":"11","status":"PL"},
                        {"tgl":"12","status":"PL"},
                        {"tgl":"13","status":"PL"},
                        {"tgl":"14","status":"PL"},
                        {"tgl":"15","status":"PL"},
                        {"tgl":"16","status":"PL"},
                        {"tgl":"17","status":"PL"},
                        {"tgl":"18","status":"PL"},
                        {"tgl":"19","status":"PL"},
                        {"tgl":"20","status":"PL"},
                        {"tgl":"21","status":"PL"},
                        {"tgl":"22","status":"PL"},
                        {"tgl":"23","status":"PL"},
                        {"tgl":"24","status":"PL"},
                        {"tgl":"25","status":"PL"},
                        {"tgl":"26","status":"PL"},
                        {"tgl":"27","status":"PL"},
                        {"tgl":"28","status":"PL"},
                        {"tgl":"29","status":"PL"},
                        {"tgl":"30","status":"PL"},
                        {"tgl":"31","status":"PL"}
                    ]
                },
                {
                    "month":0,
                    "year":2018,
                    "data":[
                        {"tgl":"1","status":"PL"},
                        {"tgl":"2","status":"PL"},
                        {"tgl":"3","status":"PL"},
                        {"tgl":"4","status":"PL"},
                        {"tgl":"5","status":"PL"},
                        {"tgl":"6","status":"PL"},
                        {"tgl":"7","status":"PL"},
                        {"tgl":"8","status":"PL"},
                        {"tgl":"9","status":"PL"},
                        {"tgl":"10","status":"PL"},
                        {"tgl":"11","status":"PL"},
                        {"tgl":"12","status":"PL"},
                        {"tgl":"13","status":"PL"},
                        {"tgl":"14","status":"PL"},
                        {"tgl":"15","status":"PL"},
                        {"tgl":"16","status":"PL"},
                        {"tgl":"17","status":"PL"},
                        {"tgl":"18","status":"PL"},
                        {"tgl":"19","status":"PL"},
                        {"tgl":"20","status":"PL"},
                        {"tgl":"21","status":"PL"},
                        {"tgl":"22","status":"PL"},
                        {"tgl":"23","status":"PL"},
                        {"tgl":"24","status":"PL"},
                        {"tgl":"25","status":"PL"},
                        {"tgl":"26","status":"PL"},
                        {"tgl":"27","status":"PL"},
                        {"tgl":"28","status":"PL"},
                        {"tgl":"29","status":"PL"},
                        {"tgl":"30","status":"PL"},
                        {"tgl":"31","status":"PL"}
                    ]
                },
            ]
        },
        {
            "moduleID":"1",
            "module":"A",
            "code":"FA",
            "funcID":"99",
            "funcName":"Function 1",
            "PPIC":"",
            "APIC":"Gatot",
            "DDS":"",
            "devStatus":"",
            "phaseID":"1",
            "Phase":"Design",
            "checkList":[
                {
                    "month":9,
                    "year":2017,
                    "data":[
                        {"tgl":"1","status":"OP"},
                        {"tgl":"2","status":"OP"},
                        {"tgl":"3","status":"OP"},
                        {"tgl":"4","status":"OP"},
                        {"tgl":"5","status":"PL"},
                        {"tgl":"6","status":"PL"},
                        {"tgl":"7","status":"OP"},
                        {"tgl":"8","status":"PL"},
                        {"tgl":"9","status":"PL"},
                        {"tgl":"10","status":"PL"},
                        {"tgl":"11","status":"PL"},
                        {"tgl":"12","status":"PL"},
                        {"tgl":"13","status":"PL"},
                        {"tgl":"14","status":"PL"},
                        {"tgl":"15","status":"PL"},
                        {"tgl":"16","status":"PL"},
                        {"tgl":"17","status":"PL"},
                        {"tgl":"18","status":"PL"},
                        {"tgl":"19","status":"PL"},
                        {"tgl":"20","status":"PL"},
                        {"tgl":"21","status":"PL"},
                        {"tgl":"22","status":"PL"},
                        {"tgl":"23","status":"PL"},
                        {"tgl":"24","status":"PL"},
                        {"tgl":"25","status":"PL"},
                        {"tgl":"26","status":"PL"},
                        {"tgl":"27","status":"PL"},
                        {"tgl":"28","status":"PL"},
                        {"tgl":"29","status":"PL"},
                        {"tgl":"30","status":"PL"},
                        {"tgl":"31","status":"PL"}
                    ]
                },
                {
                    "month":10,
                    "year":2017,
                    "data":[
                        {"tgl":"1","status":"PL"},
                        {"tgl":"2","status":"PL"},
                        {"tgl":"3","status":"PL"},
                        {"tgl":"4","status":"PL"},
                        {"tgl":"5","status":"PL"},
                        {"tgl":"6","status":"PL"},
                        {"tgl":"7","status":"PL"},
                        {"tgl":"8","status":"PL"},
                        {"tgl":"9","status":"PL"},
                        {"tgl":"10","status":"PL"},
                        {"tgl":"11","status":"PL"},
                        {"tgl":"12","status":"PL"},
                        {"tgl":"13","status":"PL"},
                        {"tgl":"14","status":"PL"},
                        {"tgl":"15","status":"PL"},
                        {"tgl":"16","status":"PL"},
                        {"tgl":"17","status":"PL"},
                        {"tgl":"18","status":"PL"},
                        {"tgl":"19","status":"PL"},
                        {"tgl":"20","status":"PL"},
                        {"tgl":"21","status":"PL"},
                        {"tgl":"22","status":"PL"},
                        {"tgl":"23","status":"PL"},
                        {"tgl":"24","status":"PL"},
                        {"tgl":"25","status":"PL"},
                        {"tgl":"26","status":"PL"},
                        {"tgl":"27","status":"PL"},
                        {"tgl":"28","status":"PL"},
                        {"tgl":"29","status":"PL"},
                        {"tgl":"30","status":"PL"},
                    ]
                },
                {
                    "month":11,
                    "year":2017,
                    "data":[
                        {"tgl":"1","status":"PL"},
                        {"tgl":"2","status":"PL"},
                        {"tgl":"3","status":"PL"},
                        {"tgl":"4","status":"PL"},
                        {"tgl":"5","status":"PL"},
                        {"tgl":"6","status":"PL"},
                        {"tgl":"7","status":"PL"},
                        {"tgl":"8","status":"PL"},
                        {"tgl":"9","status":"FO"},
                        {"tgl":"10","status":"FO"},
                        {"tgl":"11","status":"PL"},
                        {"tgl":"12","status":"PL"},
                        {"tgl":"13","status":"PL"},
                        {"tgl":"14","status":"PL"},
                        {"tgl":"15","status":"PL"},
                        {"tgl":"16","status":"PL"},
                        {"tgl":"17","status":"PL"},
                        {"tgl":"18","status":"PL"},
                        {"tgl":"19","status":"PL"},
                        {"tgl":"20","status":"FT"},
                        {"tgl":"21","status":"PL"},
                        {"tgl":"22","status":"PL"},
                        {"tgl":"23","status":"PL"},
                        {"tgl":"24","status":"PL"},
                        {"tgl":"25","status":"PL"},
                        {"tgl":"26","status":"PL"},
                        {"tgl":"27","status":"PL"},
                        {"tgl":"28","status":"PL"},
                        {"tgl":"29","status":"PL"},
                        {"tgl":"30","status":"PL"},
                        {"tgl":"31","status":"PL"}
                    ]
                },

            ]
        },

    ] */


    dataTable;
    monthStart = 999; //start bulan dimulainya projek
    monthEnd = 0;
    monthLength; //month length terpanjang
    monthLengthObject = [];
    monthName = [];
    startYear = 0; //min
    endYear = 0; //max
    dayLength = 0;
    arrayBatasLoop = [];
    cleanArray = [];
    tmp = [];
    getMonth() {

        var once = true;
        for(let i=0 ; i<this.dataTable.length; i++){
            for(let j=0; j<this.dataTable[i].checkList.length; j++){
                if(once){
                    this.startYear = this.dataTable[i].checkList[j].year;
                    this.endYear = this.dataTable[i].checkList[j].year;
                    once = false;
                }

                if(this.startYear >= this.dataTable[i].checkList[j].year){
                    this.startYear = this.dataTable[i].checkList[j].year;
                } else{
                    this.endYear = this.dataTable[i].checkList[j].year;
                }
            }
        }

        for(let i=0 ; i<this.dataTable.length; i++){
            for(let j=0; j<this.dataTable[i].checkList.length; j++){
                if(this.dataTable[i].checkList[j].year == this.startYear){
                    if(this.dataTable[i].checkList[j].month <= this.monthStart)
                        {
                            this.monthStart = this.dataTable[i].checkList[j].month;
                        }

                }

                if(this.dataTable[i].checkList[j].year == this.endYear){
                    if(this.dataTable[i].checkList[j].month >= this.monthEnd){
                        this.monthEnd = this.dataTable[i].checkList[j].month;
                    }
                }

            }
        }

        //month length
        this.monthLength = 0;
        if(this.startYear == this.endYear){
            this.monthLength = (this.monthEnd - this.monthStart)+1;
        } else{
            for(let i=this.startYear; i<=this.endYear; i++){
                if(this.startYear == i){
                    let awal = 12-this.monthStart+1;
                    this.monthLength =  this.monthLength + awal;
                } else if(this.endYear == i){
                    let akhir  = this.monthEnd;
                    this.monthLength = this.monthLength + akhir;
                } else{
                    this.monthLength = this.monthLength+12;
                }
            }
        }

        for(let i=0; i<this.monthLength; i++){
            this.monthLengthObject.push("");
        }


    console.log("START YEAR : "+this.startYear);
    console.log("END YEAR : "+this.endYear);
    var year = this.startYear;
    var tampung = this.monthStart;
    console.log("Month Start : "+this.monthStart);
    console.log("Month End : "+this.monthEnd);
    console.log("Month Length : "+this.monthLength);
        for(let indeks=1 ; indeks<=this.monthLength; indeks++){
            if(tampung > 12){
                tampung = tampung % 12;
            }
            console.log("tampung : "+tampung);
            switch(tampung) {
               case 1: {
                  this.monthName.push({"name":"January","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("January",year);
                  this.arrayBatasLoop.push({"month":1,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 2: {
                  this.monthName.push({"name":"February","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("February",year);
                  this.arrayBatasLoop.push({"month":2,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 3: {
                  this.monthName.push({"name":"March","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("March",year);
                  this.arrayBatasLoop.push({"month":3,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 4: {
                  this.monthName.push({"name":"April","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("April",year);
                  this.arrayBatasLoop.push({"month":4,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 5: {
                  this.monthName.push({"name":"May","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("May",year);
                  this.arrayBatasLoop.push({"month":5,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 6: {
                  this.monthName.push({"name":"June","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("June",year);
                  this.arrayBatasLoop.push({"month":6,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 7: {
                  this.monthName.push({"name":"July","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("July",year);
                  this.arrayBatasLoop.push({"month":7,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 8: {
                  this.monthName.push({"name":"August","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("August",year);
                  this.arrayBatasLoop.push({"month":8,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 9: {
                  this.monthName.push({"name":"September","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("September",year);
                  this.arrayBatasLoop.push({"month":9,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 10: {
                  this.monthName.push({"name":"October","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("October",year);
                  this.arrayBatasLoop.push({"month":10,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 11: {
                  this.monthName.push({"name":"November","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("November",year);
                  this.arrayBatasLoop.push({"month":11,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  break;
               }
               case 12: {
                  this.monthName.push({"name":"December","year":year});
                  this.dayLength = this.dayLength + this.monthColSpan("December",year);
                  this.arrayBatasLoop.push({"month":12,"padding":this.dayLength,"year":year});
                  tampung = tampung + 1;
                  year = year + 1;
                  break;
               }
            }
        }
        console.log("ARRAY PADDING : ");
        console.log(this.arrayBatasLoop);
        console.log("DAY LENGTH : ", this.dayLength);
        for(let i=0; i<this.arrayBatasLoop.length; i++){
            if(i==0){
                this.cleanArray.push({"month":this.arrayBatasLoop[i].month, "padding":0, "year":this.arrayBatasLoop[i].year});
            } else{
                this.cleanArray.push({"month":this.arrayBatasLoop[i].month, "padding":this.arrayBatasLoop[i-1].padding, "year":this.arrayBatasLoop[i].year});
            }
        }

        console.log("CLEAN :");
        console.log(this.cleanArray);


    }

    toggle:boolean = true;
    //get number of first padding
    getFirstPadding(currentMonth, currentYear){
        let padding = 0;
        if(this.toggle == true){
            for(let i=0; i<this.cleanArray.length; i++){
                if((this.cleanArray[i].month == currentMonth)&&(this.cleanArray[i].year == currentYear)){
                    padding = this.cleanArray[i].padding;
                }
            }
            return padding;
        }

        return 0;
    }

    dataMaster= [];
    batasLoop = this.monthLength;
    offScreening = [];
    //checklist.length = berapa banyak bulan
    getData(){
        let row = [];
        let tmpMonth;
        for(let i=0; i<this.dataTable.length; i++){
            this.toggle = true;
            for(let j=0; j<this.dataTable[i].checkList.length; j++){
                //padding depan
                for(let m = 0; m < this.getFirstPadding(this.dataTable[i].checkList[j].month, this.dataTable[i].checkList[j].year); m++){
                    row.push({"tgl":"","status":""});
                }
                //data tengah
                for(let k=0; k<this.dataTable[i].checkList[j].data.length; k++){
                    //i == function/fase, j == bulan, k == hari(tgl)
                    row.push({"tgl":this.dataTable[i].checkList[j].data[k].tgl,"status":this.dataTable[i].checkList[j].data[k].status});
                    //cek jika ada off date masukkan indek i,j,k ke array offscreening
                    if(this.dataTable[i].checkList[j].data[k].status == "OFF"){
                        this.offScreening.push({"i":i, "j":j, "k":k});
                    }
                }
                this.toggle = false;

            }

            //padding belakang
            if(row.length < this.dayLength){
                let selisih= this.dayLength - row.length;
                for(let i=0; i<selisih; i++){
                    row.push({"tgl":"","status":""});
                }
            }


            //ganti baris
            this.dataMaster.push(row);
            row = [];
        }

/*         console.log(row);
        console.log(this.dataMaster); */

    }

    screeningOffDate(){
        let row = [];
        this.dataMaster = [];
        let tmpMonth;
        for(let i=0; i<this.dataTable.length; i++){
            this.toggle = true;
            for(let j=0; j<this.dataTable[i].checkList.length; j++){
                //padding depan
                for(let m = 0; m < this.getFirstPadding(this.dataTable[i].checkList[j].month, this.dataTable[i].checkList[j].year); m++){
                    //cocokkan dengan array offdate
                    let toggle = false;
                    for(let n=0; n<this.offScreening.length; n++){
                        if(((i == this.offScreening[n].i)&&(j == this.offScreening[n].j))&&(m == this.offScreening[n].k)){
                            row.push({"tgl":"","status":"OFF"});
                            toggle = true;
                        }
                    }

                    if(toggle != true){
                        row.push({"tgl":"","status":""});
                    }

                }
                //data tengah
                for(let k=0; k<this.dataTable[i].checkList[j].data.length; k++){
                    //cocokkan dengan array offdate
                    let toggle = false;
                    for(let n=0; n<this.offScreening.length; n++){
                        if(((i == this.offScreening[n].i)&&(j == this.offScreening[n].j))&&(k == this.offScreening[n].k)){
                            row.push({"tgl":"","status":"OFF"});
                            toggle = true;
                        }
                    }

                    if(toggle != true){
                        row.push({"tgl":"","status":""});
                    }
                }
                this.toggle = false;

            }

            //padding belakang
/*             if(row.length < this.dayLength){
                let selisih= this.dayLength - row.length;
                for(let i=selisih; i>0; i--){
                    for(let w=0; w<i-1; w++){
                        row.push({"tgl":"","status":""});
                    }

                    for(let n=0; n<this.offScreening.length; n++){
                        if(this.offScreening[n].k == i)
                            console.log("flag");
                        row.push({"tgl":"","status":"OFF"});
                    }
                }
            } */


            //ganti baris
            this.dataMaster.push(row);
            row = [];
        }
    }

    monthColSpan(monthName, Year): number{
        switch(monthName) {
               case "January": {
                  return 31;
               }
               case "February": {
                  if((Year % 4) == 0){
                      return 29;
                  } else{
                      return 28;
                  }
               }
               case "March": {
                return 31;
               }
               case "April": {
                  return 30;
               }
               case "May": {
                  return 30;
               }
               case "June": {
                  return 30;
               }
               case "July": {
                  return 31;
               }
               case "August": {
                  return 31
               }
               case "September": {
                  return 30;
               }
               case "October": {
                  return 31;
               }
               case "November": {
                  return 30;
               }
               case "December": {
                  return 31
               }
        }
    }

    tglList = [];
    getTglList(){
        console.log(this.monthName);
        for(let i=0; i<this.monthName.length; i++){
            let batas = this.monthColSpan(this.monthName[i].name, this.monthName[i].year);
            for(let j=1; j<=batas; j++){
                this.tglList.push(j);
            }
        }
        console.log(this.tglList);
    }

    //DASHBOARD DATASOURCE
    projectData:any = [];
    projectStepData:any = [];
    startDatePro; //dashboard
    endDatePro; //dashboard

    startDateEdit; //edit module
    endDateEdit; //edit module
    dataStatistik = [];
    tampungStatistikClean = [];

    dataStatistikModule = [];
    tStatistikModuleClean= [];

    //dataTable pagination
    countPageDataTable;
    pageDataTable = 1;
    pageSizeDataTable;
    lastDashboardData: any;
    globalUserID;

    constructor(private modalService: NgbModal,
                public router: Router,
                public http: Http,
                public authHttp: AuthHttp,
                public dashboarsSer: DashboardService,
                private cd: ChangeDetectorRef,
                public progressService: NgProgressService) {
        this.globalUserID = localStorage.getItem('userID');
        this.margin = 0;
        this.progressService.start();
        this.ROLE = localStorage.getItem('role');
        this.userName = localStorage.getItem('userName');
        let once = true;
        let selectData = [];
        let initialProject= [];
        http.get(this.PROJECT_DATA_END_POINT, this.options)
            .subscribe(params=>{
                this.projectData = params.json();

                if(once && this.projectData!=null){
                    //set default project name
                    //this.formDashboard.get('projectName').setValue(this.projectData[0].project_name);
                    this.projectGlobalName = this.projectData[0].project_name;
                    this.formDashboard.get('projectTitle').setValue(this.projectData[0].project_name);
                    this.formDashboard.get('clientName').setValue(this.projectData[0].project_client_name);
                    this.formDashboard.get('clientEmail').setValue(this.projectData[0].project_client_email);
                    this.formDashboard.get('clientPhone').setValue('0'+this.projectData[0].project_client_phone);
                    this.formDashboard.get('clientAddress').setValue(this.projectData[0].project_client_address);

                    this.formDashboard.get('projectID').setValue(this.projectData[0].project_id);
                    this.formDashboard.get('startDate').setValue(this.projectData[0].project_start_date);
                    this.formDashboard.get('endDate').setValue(this.projectData[0].project_end_date);
                    this.dashboarsSer.setSelectBox(this.projectData[0].project_id);
                    this.startDatePro = this.projectData[0].project_start_date;
                    this.endDatePro = this.projectData[0].project_end_date;
                    this.currentProjectID = this.projectData[0].project_id;
                    once = false;
                    for(let i=0; i<this.projectData.length; i++){
                        selectData.push(this.projectData[i].project_name);
                    }
                    this.items = selectData;
                    initialProject.push(selectData[0]);
                    this.active = initialProject;
                    console.log("active project : "+this.active);

                    let dashboardData = {
                        "project_id":this.currentProjectID,
                        "row_number":10,
                        "page_number":1,
                        "filter_search":{}
                    };
                    //dashboard data
                    this.http.post(this.DASHBOARD_POST, dashboardData, this.options)
                        .subscribe(params=>{
                            let dashboardValue = params.json();
                            this.dataTable = dashboardValue.table;
                            this.dataStatistik.push(dashboardValue.summary.pic);
                            this.dataStatistikModule.push(dashboardValue.summary.module);

                            if(params!=null){
                                this.getMonth();
                                this.getTglList();
                                this.getData();

                                this.countPageDataTable = dashboardValue.page_count*dashboardData.row_number;
                                this.pageDataTable = 1;
                                this.pageSizeDataTable = dashboardData.row_number;

/*                                 console.log("countPageDataTable : "+this.countPageDataTable);
                                console.log("pageDataTable : "+this.pageDataTable);
                                console.log("pageSizeDataTable : "+this.pageSizeDataTable);

                                console.log("dataStatistik : ");
                                console.log(this.dataStatistik);
                                console.log("dataStatistikModule : ");
                                console.log(this.dataStatistikModule); */
                                let tam;
                                for(let item in this.dataStatistik[0]){
                                    if( this.dataStatistik[0].hasOwnProperty(item)) {
                                        tam = this.dataStatistik[0];
                                        this.tampungStatistikClean.push(tam[item]);
                                    }
                                }

                                let tam2;
                                for(let item in this.dataStatistikModule[0]){
                                    if(this.dataStatistikModule[0].hasOwnProperty(item)) {
                                        tam2 = this.dataStatistikModule[0];
                                        this.tStatistikModuleClean.push(tam2[item]);
                                    }
                                }
                            }
                        });


                    this.progressService.done();
                }

            });

    }

    changePageDataTable(){
        this.tglList = [];
        this.monthStart = 999; //start bulan dimulainya projek
        this.monthEnd = 0;
        this.monthLength; //month length terpanjang
        this.monthLengthObject = [];
        this.monthName = [];
        this.startYear = 0; //min
        this.endYear = 0; //max
        this.dayLength = 0;
        this.arrayBatasLoop = [];
        this.cleanArray = [];
        this.tmp = [];
        this.dataMaster= [];
        this.batasLoop = this.monthLength;
        this.dataStatistik = [];
        this.tampungStatistikClean = [];
        this.dataStatistikModule = [];
        this.tStatistikModuleClean= [];
        let dashboardData = {
            "project_id":this.currentProjectID,
            "row_number":10,
            "page_number":this.pageDataTable,
            "filter_search":{
                "function_name":"",
                "module_name":"",
                "pic":"",
                "phase_name":[]}
        };

/*         functionNameSearch;
        moduleNameSearch;
        picSearch;
        phaseNameSearch; */

        if((this.functionNameSearch == true)||(this.moduleNameSearch == true)||(this.picSearch == true)||(this.phaseNameSearch)){
            dashboardData = this.lastDashboardData;
            dashboardData.page_number = this.pageDataTable;
        }

        this.dataTable = [];
        this.dataStatistik = [];
        this.dataStatistikModule = [];
        this.tampungStatistikClean = [];
        this.tStatistikModuleClean = [];

        this.http.post(this.DASHBOARD_POST, dashboardData, this.options)
        .subscribe(params=>{
            let dashboardValue = params.json();
            console.log("dashboard : ");
            console.log(dashboardValue);
            this.dataTable = dashboardValue.table;
            this.dataStatistik.push(dashboardValue.summary.pic);
            this.dataStatistikModule.push(dashboardValue.summary.module);

            if(params!=null){
                this.getMonth();
                this.getTglList();
                this.getData();

                this.countPageDataTable = dashboardValue.page_count*dashboardData.row_number;
                this.pageSizeDataTable = dashboardData.row_number;

                console.log("countPageDataTable : "+this.countPageDataTable);
                console.log("pageDataTable : "+this.pageDataTable);
                console.log("pageSizeDataTable : "+this.pageSizeDataTable);

                console.log("dataStatistik : ");
                console.log(this.dataStatistik);
                console.log("dataStatistikModule : ");
                console.log(this.dataStatistikModule);
                let tam;
                for(let item in this.dataStatistik[0]){
                    if( this.dataStatistik[0].hasOwnProperty(item)) {
                        tam = this.dataStatistik[0];
                        this.tampungStatistikClean.push(tam[item]);
                    }
                }

                let tam2;
                for(let item in this.dataStatistikModule[0]){
                    if(this.dataStatistikModule[0].hasOwnProperty(item)) {
                        tam2 = this.dataStatistikModule[0];
                        this.tStatistikModuleClean.push(tam2[item]);
                    }
                }
            }
        });
    }



    reloadDataTable(){
        this.progressService.start();
        this.tglList = [];
        this.monthStart = 999; //start bulan dimulainya projek
        this.monthEnd = 0;
        this.monthLength; //month length terpanjang
        this.monthLengthObject = [];
        this.monthName = [];
        this.startYear = 0; //min
        this.endYear = 0; //max
        this.dayLength = 0;
        this.arrayBatasLoop = [];
        this.cleanArray = [];
        this.tmp = [];
        this.dataMaster= [];
        this.batasLoop = this.monthLength;
        this.dataStatistik = [];
        this.tampungStatistikClean = [];
        this.dataStatistikModule = [];
        this.tStatistikModuleClean= [];
        let dashboardData = {
            "project_id":this.currentProjectID,
            "row_number":10,
            "page_number":1,
            "filter_search":{}
        };
        this.dataTable = [];
        this.dataStatistik = [];
        this.dataStatistikModule = [];
        this.tampungStatistikClean = [];
        this.tStatistikModuleClean = [];
        //dashboard data
        this.http.post(this.DASHBOARD_POST, dashboardData, this.options)
            .subscribe(params=>{
                let dashboardValue = params.json();
                console.log("dashboard : ");
                console.log(dashboardValue.table);
                this.dataTable = dashboardValue.table;
                this.dataStatistik.push(dashboardValue.summary.pic);
                this.dataStatistikModule.push(dashboardValue.summary.module);

                if(params!=null){
                    this.getMonth();
                    this.getTglList();
                    this.getData();
                    /* this.screeningOffDate(); */

                    this.countPageDataTable = dashboardValue.page_count*dashboardData.row_number;
                    this.pageDataTable = 1;
                    this.pageSizeDataTable = dashboardData.row_number;

                    console.log("countPageDataTable : "+this.countPageDataTable);
                    console.log("pageDataTable : "+this.pageDataTable);
                    console.log("pageSizeDataTable : "+this.pageSizeDataTable);

                    console.log("dataStatistik : ");
                    console.log(this.dataStatistik[0]);
                    console.log("dataStatistikModule : ");
                    console.log(this.dataStatistikModule[0]);

                    let tam;
                    for(let item in this.dataStatistik[0]){
                        if( this.dataStatistik[0].hasOwnProperty(item)) {
                            tam = this.dataStatistik[0];
                            this.tampungStatistikClean.push(tam[item]);
                        }
                    }

                    let tam2;
                    for(let item in this.dataStatistikModule[0]){
                        if(this.dataStatistikModule[0].hasOwnProperty(item)) {
                            tam2 = this.dataStatistikModule[0];
                            this.tStatistikModuleClean.push(tam2[item]);
                        }
                    }
                }
            });
        this.progressService.done();
    }

    changeName(value){
        this.progressService.start();
        if(value){
            this.buttonString = "Save Project";
        } else{
            this.buttonString = "Edit Project";
            let project_title = this.formDashboard.get('projectTitle').value;
            let sendData = {
                "project_id":this.formDashboard.get('projectID').value,
                "project_name":project_title,
                "project_client_name":this.formDashboard.get('clientName').value,
                "project_client_address":this.formDashboard.get('clientAddress').value,
                "project_client_phone":this.formDashboard.get('clientPhone').value,
                "project_client_email":this.formDashboard.get('clientEmail').value};
            this.http.post(this.UPDATE_PROJECT, sendData, this.options)
                .subscribe(params=>{
                    swal(
                        'Good Job!',
                        'Successfully',
                        'success'
                    );

                        //updateView
                        let selectData = [];
                        let initialProject= [];
                        this.http.get(this.PROJECT_DATA_END_POINT, this.options)
                            .subscribe(params=>{
                                this.projectData = params.json();
                                console.log(this.projectData);
                                    let index;
                                    for(let i=0; i<this.projectData.length; i++){
                                        selectData.push(this.projectData[i].project_name);
                                        if(this.projectData[i].project_id == this.formDashboard.get('projectID').value){
                                            index = i;
                                        }
                                    }
                                    this.items = selectData;
                                    initialProject.push(selectData[index]);
                                    this.active = initialProject;
                                    this.progressService.done();
                            });

                },
                (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
                });
        }
    }

    Page(){
        this.progressService.start();
        let tmp;
        let sendData
        if((this.isSearchRole == true)&&(this.isSearchName == true)){
            sendData = {
                "page":this.page,
                "filter_search":{"name":this.searchName, "role":this.searchRole}
            }
        } else if(this.isSearchRole == true){
            sendData = {
                "page":this.page,
                "filter_search":{"role":this.searchRole}
            }
        } else if(this.isSearchName == true){
            sendData = {
                "page":this.page,
                "filter_search":{"name":this.searchName}
            }
        } else {
            sendData = {
                "page":this.page,
                "filter_search":{}
            }
        }

        this.http.post(this.USERMANAGEMENT_SEARCH, sendData, this.options)
            .subscribe(params=>{
                tmp = params.json();
                this.response = tmp.rows;
                this.countPage = tmp.count;
                this.progressService.done();
            });
    }

    updateProjectList(){
        this.progressService.start();
        let selectData = [];
        let initialProject= [];
        this.http.get(this.PROJECT_DATA_END_POINT, this.options)
            .subscribe(params=>{
                this.projectData = params.json();
                    console.log("project list updated");
                    for(let i=0; i<this.projectData.length; i++){
                        selectData.push(this.projectData[i].project_name);
                    }
                    this.items = selectData;
                    initialProject.push(selectData[0]);
                    this.active = initialProject;
                    this.progressService.done();
            });
    }

    projectNameChange(value){
        this.projectGlobalName = value.text;
        let choosenID;
        for(let i=0;i<this.projectData.length;i++){
            if(this.projectData[i].project_name == value.text){
                choosenID = this.projectData[i].project_id;
                this.currentProjectID = choosenID;
                this.startDatePro = this.projectData[i].project_start_date;
                this.endDatePro = this.projectData[i].project_end_date;
                this.formDashboard.get('projectTitle').setValue(this.projectData[i].project_name);
                this.formDashboard.get('projectTitle').setValue(this.projectData[i].project_name);
                this.formDashboard.get('clientName').setValue(this.projectData[i].project_client_name);
                this.formDashboard.get('clientEmail').setValue(this.projectData[i].project_client_email);
                this.formDashboard.get('clientPhone').setValue('0'+this.projectData[i].project_client_phone);
                this.formDashboard.get('clientAddress').setValue(this.projectData[i].project_client_address);
            }
        }
        this.formDashboard.get('projectID').setValue(choosenID);
        this.formDashboard.get('startDate').setValue(this.startDatePro);
        this.formDashboard.get('endDate').setValue(this.endDatePro);
        this.dashboarsSer.setSelectBox(choosenID);
    }

    formsSelect = new FormGroup({
        role: new FormControl('',Validators.required)
    });

    formsActivated = new FormGroup({
        activated: new FormControl('',Validators.required)
    });

    deleteFunction(function_id){
        this.progressService.start();
        let dataSend = {
            "function_id":function_id
        };

        swal({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(params=>{
            //if success, place code here
            this.http.post(this.DELETE_FUNCTION, dataSend, this.options)
                .subscribe(params=>{
                    swal(
                        'Good Job!',
                        'Successfully',
                        'success'
                    );

                    //update function list
                    this.getFuncListbyID();
                    this.progressService.done();
                },
                (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
                });
        })
    }

    deletePhase(phase_id){
        this.progressService.start();
        let dataSend = {
            "phase_id":phase_id
        };
        swal({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(params=>{
            this.http.post(this.DELETE_PHASE, dataSend, this.options)
                .subscribe(params=>{
                    swal(
                        'Good Job!',
                        'Successfully',
                        'success'
                    );

        //update dashboard
        this.updateDashboard(this.currentProjectID);

        this.filteredPhase = [];
        this.filteredPhaseWithName = [];
        let module_name;
        let phaseList;
        let function_id = this._FUNCTION_ID;

        //fetch phase based on function ID that has been choosen phaseEditList
        this.http.get(this.GET_PHASE_LIST, this.options)
            .subscribe(params=>{
                phaseList = params.json();

                for(let i=0; i<phaseList.length; i++){
                    if(phaseList[i].phase_function_id == function_id){
                        this.filteredPhase.push(phaseList[i]);
                    }
                }
                //get phase name list
                this.filteredPhaseWithName = [];
                this.http.get(this.GET_LIST_PHASE_NAME, this.options)
                    .subscribe(params=>{
                        let phaseNameList = params.json();
                        for(let i=0; i<this.filteredPhase.length; i++){
                            for(let j=0; j<phaseNameList.length; j++){
                                if(this.filteredPhase[i].phase_phasename_id == phaseNameList[j].phasename_id){
                                    this.filteredPhaseWithName.push({
                                        "phase_id":this.filteredPhase[i].phase_id,
                                        "phase_name":phaseNameList[j].phasename_name,
                                        "phase_start_date":this.filteredPhase[i].phase_start_date,
                                        "phase_end_date":this.filteredPhase[i].phase_end_date,
                                        "project_id":this.currentProjectID,
                                        "percentage":this.filteredPhase[i].progress_percentage});
                                }
                            }
                        }
                        console.log("final phase : ");
                        console.log(this.filteredPhaseWithName);
                        this.progressService.done();
                    });
                });


                },
                (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
                });

        })
    }

    changeValue(ev, user_id) {
        let newRole;
        if(ev == "PM"){
            newRole = "1";
        } else if(ev == "SA"){
            newRole = "2";
        } else if(ev == "PG"){
            newRole = "3";
        }

        for(let i=0; i<this.response.length; i++){
            if(this.response[i].id_user == user_id){
                this.response[i].role = newRole;
            }
        }
        console.log(this.response);
    }


    changeValue2(ev, user_id) {
        let newActivatedStatus;
        if(ev == "active"){
            newActivatedStatus = "active";
        } else if(ev == "inactive"){
            newActivatedStatus = "inactive";
        }

        for(let i=0; i<this.response.length; i++){
            if(this.response[i].id_user == user_id){
                this.response[i].activated_status = newActivatedStatus;
            }
        }
        console.log(this.response);
    }


    approveUser(user_id) {
        this.progressService.start();
        for(let i=0; i<this.response.length; i++){
            if(this.response[i].id_user == user_id){
                this.dataAcc.id_user = this.response[i].id_user;
                this.dataAcc.role = this.response[i].role;
                this.dataAcc.activated_status = this.response[i].activated_status;
            }
        }


        this.http.post(this.APPROVE_REJECT_END_POINT,this.dataAcc, this.options)
            .subscribe(params=>{
                // get users from api
                this.updateUserMan(this.page);
                swal(
                    'Good Job!',
                    'User approved',
                    'success'
                );
                this.progressService.done();
            },
            (err)=>{
                 swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );
                this.progressService.done();
            });
    }

    getFuncListbyID(){
     //get function list that contain module id that we got and save into funcListByModuleID: array of object
     this.progressService.start();
     let tmpFunc;
     this.funcListByModuleID = [];
     this.http.get(this.GET_LIST_FUNCTION, this.options)
        .subscribe(params=>{
            //uncommnet if the api works
            //this.funcListByModuleID = params.json()
            tmpFunc = params.json();
            //dapetin fungsi yang punya id sama dengan id module
            for(let i=0; i<tmpFunc.length; i++){
                if(tmpFunc[i].function_module_id == this.formEditModule.get('moduleIDEdit').value){
                    this.funcListByModuleID.push(tmpFunc[i]);
                }
            }
            console.log("*functionlistByModule");
            console.log(this.funcListByModuleID);
            this.progressService.done();
        },
        (err)=>{
                 swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );
                this.progressService.done();
        });
    }

      //open modal edit Module/Function
      openEdit(content) {
        this.progressService.start();
        let tmp: any[];
        this.currentProjectID = this.formDashboard.get('projectID').value;
        //console.log(currentProjectID);
        this.moduleList = [];
        this.http.get(this.GET_MODULE_LIST, this.options)
            .subscribe(params=>{
                this.tmp = params.json();
                //console.log(this.tmp);
                if(this.tmp != null){
                    for(let i=0; i<this.tmp.length; i++){
                        if(this.tmp[i].module_project_id == this.currentProjectID){
                            this.moduleList.push(this.tmp[i]);
                        }
                    }

                    this.currentModuleName = this.moduleList[0].module_name;
                    this.currentModuleCode = this.moduleList[0].module_code_name;
                    this.formEditModule.get('moduleName2').setValue(this.moduleList[0].module_name);
                    this.formEditModule.get('moduleIDEdit').setValue(this.moduleList[0].module_id);
                    this.formEditModule.get('moduleCode2').setValue(this.moduleList[0].module_code_name);
                    //console.log(this.formEditModule.get('moduleIDEdit').value);
                    this.getFuncListbyID();
                    this.progressService.done();

                }
            });

        this.modalService.open(content).result.then((result) => {
          this.progressService.done();
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.progressService.done();
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }

    updateViewMoFu(){
        this.progressService.start();
        let tmp: any[];
        //console.log(currentProjectID);
        this.moduleList = [];
        this.http.get(this.GET_MODULE_LIST, this.options)
            .subscribe(params=>{
                this.tmp = params.json();
                //console.log(this.tmp);
                if(this.tmp != null){
                    for(let i=0; i<this.tmp.length; i++){
                        if(this.tmp[i].module_project_id == this.currentProjectID){
                            this.moduleList.push(this.tmp[i]);
                        }
                    }
                    this.getFuncListbyID();

                }
                this.progressService.done();
            });
    }

    updateUserMan(page_approved?){
        // get users from api
        if(page_approved == null){
            page_approved = 1;
        }
        this.progressService.start();
        let tmp;
        let sendData = {
                "page":page_approved,
                "filter_search":{}
            }
        this.http.post(this.USERMANAGEMENT_SEARCH, sendData, this.options)
            .subscribe(params=>{
                tmp = params.json();
                this.response = tmp.rows;
                this.countPage = tmp.count;
                console.log(this.response);
                this.progressService.done();
            });
    }


    //MODAL CODE START
    open(content) {
      this.progressService.start();
      this.modalService.open(content).result.then((result) => {
        this.progressService.done();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.progressService.done();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });

      // get users from api
      this.updateUserMan();

    }

    semangat(value){
        console.log(value);
    }

    openEditUser(content, name, role, id_user, activated_status, verified_status) {
        let temp: any;
        this.modalReference = this.modalService.open(content);
        this.formsEditUser.get('name').setValue(name);
        if(role == '1') {
            temp = "PM";
        } else if(role == '2') {
            temp = "SA";
        } else if(role == '3') {
            temp = "PG";
        }
        this.formsEditUser.get('id_user').setValue(id_user);
        this.formsEditUser.get('role').setValue(temp);
        this.formsEditUser.get('status').setValue(activated_status);
        this.formsEditUser.get('verified').setValue(verified_status);


        //abis itu post http ke end point
    }

    private getDismissReason(reason: any): string {
      this.progressService.done();
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }

    }

    deleteUser(id_user) {
        this.progressService.start();
        swal({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(params=>{
            this.data.id_user = id_user;
            this.http.post(this.DELETE_END_POINT,this.data, this.options)
                .subscribe(params=>{
                  // get users from api
                  this.updateUserMan(this.page);

                    swal(
                        'Good Job!',
                        'Deleted successfully',
                        'success'
                    );
                    this.progressService.done();
                },
                (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
                });
        })


    }

    editUser() {
        this.progressService.start();
        let tmp: any;
        if(this.formsEditUser.get('role').value == "PG") {
            tmp = "3";
        } else if(this.formsEditUser.get('role').value == "SA") {
            tmp = "2";
        } else if(this.formsEditUser.get('role').value == "PM") {
            tmp = "1";
        }

        if(this.formsEditUser.get('password').value !== "") {
            this.dataEdit.name = this.formsEditUser.get('name').value;
            this.dataEdit.id_user = this.formsEditUser.get('id_user').value;
            this.dataEdit.role = tmp;
            this.dataEdit.verified_status = this.formsEditUser.get('verified').value;
            this.dataEdit.activated_status = this.formsEditUser.get('status').value;
            this.dataEdit.password = this.formsEditUser.get('password').value;
        } else {
            this.dataEdit2.name = this.formsEditUser.get('name').value;
            this.dataEdit2.id_user = this.formsEditUser.get('id_user').value;
            this.dataEdit2.role = tmp;
            this.dataEdit2.verified_status = this.formsEditUser.get('verified').value;
            this.dataEdit2.activated_status = this.formsEditUser.get('status').value;
        }

        if(this.formsEditUser.get('password').value !== "") {
            this.http.post(this.EDIT_USER_END_POINT,this.dataEdit, this.options)
                .subscribe(params=>{
                  // get users from api
                  this.updateUserMan();

                    swal(
                        'Good Job!',
                        'it has been updated',
                        'success'
                    );
                    this.progressService.done();

                },
                (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
                });
        } else {
            this.http.post(this.EDIT_USER_END_POINT,this.dataEdit2, this.options)
                .subscribe(params=>{
                  // get users from api
                  this.updateUserMan();

                    swal(
                        'Good Job!',
                        'it has been updated',
                        'success'
                    );
                    this.progressService.done();
                    this.modalReference.dismiss();
                },
                (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
                });
        }

    }

    //MODAL CODE END

    //NAVBAR CODE START
    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }
    //NAVBAR CODE END

    //USER MANAGEMENT EDIT USER
    formsEditUser = new FormGroup({
        name: new FormControl('',Validators.required),
        role: new FormControl('',Validators.required),
        password: new FormControl('',),
        status: new FormControl('',Validators.required),
        id_user: new FormControl('',Validators.required),
        verified: new FormControl('',Validators.required)
    });

    formFilterTable =  new FormGroup({
        PIC: new FormControl('',Validators.required),
        ModuleName: new FormControl('',Validators.required),
        FuncName: new FormControl('',),
        Phase: new FormControl('',Validators.required)
    });

    formNumRow =  new FormGroup({
        numOfRow: new FormControl('',Validators.required),
    });

    //FORM DASHBOARD
    formDashboard = new FormGroup({
        projectName: new FormControl('',Validators.required),
        phaseStep: new FormControl('',Validators.required),
        startDate: new FormControl('',Validators.required),
        endDate: new FormControl('',Validators.required),
        projectID: new FormControl('',Validators.required),
        projectTitle: new FormControl('',Validators.required),
        projectStatus: new FormControl('',Validators.required),
        clientName: new FormControl('',Validators.required),
        clientAddress: new FormControl('',Validators.required),
        clientPhone: new FormControl('',Validators.required),
        clientEmail: new FormControl('',Validators.required)
    });

    //FORM EDIT ROW
    formEditRow = new FormGroup({
        moduleName: new FormControl('',Validators.required),
        startDate: new FormControl('',Validators.required),
        endDate: new FormControl('',Validators.required)
    });

    //FORM EDIT MODULE MODAL
    formEditModule = new FormGroup({
        moduleName: new FormControl('',Validators.required),
        moduleName2: new FormControl('',Validators.required),
        moduleCode2: new FormControl('',Validators.required),
        startDate: new FormControl('',Validators.required),
        endDate: new FormControl('',Validators.required),
        moduleIDEdit: new FormControl('',Validators.required)
    });

    formEditRow2 = new FormGroup({
        moduleName: new FormControl('',Validators.required),
        funcName2: new FormControl('',Validators.required),
        startDate: new FormControl('',Validators.required),
        endDate: new FormControl('',Validators.required),
        fCode2: new FormControl('',Validators.required),

    });

    formSearch = new FormGroup({
        employeeName: new FormControl('',Validators.required),
        employeeRole: new FormControl('',Validators.required)

    });

    formEditFunc = new FormGroup({
        status: new FormControl('',Validators.required)
    });

    fetchModuleData(value){
        this.progressService.start();
        let List = [];
        let funcListByModuleID = [];
        //first, get module id base on module name from select box
        //get module id base on module name
        this.http.get(this.GET_MODULE_LIST, this.options)
            .subscribe(params=>{
                List = params.json();

                for(let i=0; i<List.length; i++){
                    if(List[i].module_name == value){
                        this.currentModuleName = List[i].module_name;
                        this.currentModuleCode = List[i].module_code_name;
                        this.formEditModule.get('moduleIDEdit').setValue(List[i].module_id);
                        this.formEditModule.get('moduleName2').setValue(List[i].module_name);
                        this.formEditModule.get('moduleCode2').setValue(List[i].module_code_name);
                        console.log(this.formEditModule.get('moduleIDEdit').value);
                        //get function list that contain module id that we got and save into funcListByModuleID: array of object
                        this.getFuncListbyID();
                    }
                }
                this.progressService.done();
            })
    }

    //update phase list
    updatePhaseList(function_id){
        console.log("phase update emitted");
        this.progressService.start();
        this.filteredPhaseWithName = [];
        let phaseList;
        this.filteredPhase = [];
        this.http.get(this.GET_PHASE_LIST, this.options)
            .subscribe(params=>{
                phaseList = params.json();
                console.log("phaseList : ");
                console.log(phaseList);
                if(phaseList!=null){
                    for(let i=0; i<phaseList.length; i++){
                        if(phaseList[i].phase_function_id == function_id){
                            this.filteredPhase.push(phaseList[i]);
                        }
                    }
                    console.log("*filteredPhase : ");
                    console.log(this.filteredPhase);


                    //get phase name list
                    this.http.get(this.GET_LIST_PHASE_NAME, this.options)
                        .subscribe(params=>{
                            let phaseNameList = params.json();
                            if(params!=null){
                                console.log("PhaseNameList : ");
                                console.log(phaseNameList);
                                for(let i=0; i<this.filteredPhase.length; i++){
                                    for(let j=0; j<phaseNameList.length; j++){
                                        if(this.filteredPhase[i].phase_phasename_id == phaseNameList[j].phasename_id){
                                            this.filteredPhaseWithName.push({
                                                "phase_id":this.filteredPhase[i].phase_id,
                                                "phase_name":phaseNameList[j].phasename_name,
                                                "phase_start_date":this.filteredPhase[i].phase_start_date,
                                                "phase_end_date":this.filteredPhase[i].phase_end_date,
                                                "project_id":this.currentProjectID,
                                                "percentage":this.filteredPhase[i].progress_percentage});
                                        }
                                    }
                                }
                                console.log("filteredPhaseWithName");
                                console.log(this.filteredPhaseWithName);
                            }
                            this.progressService.done();
                        });
                }
            });
    }

    //buka edit function (yg ada functon list)
    openPhaseEdit(content, function_id, function_name, function_code){
        this.progressService.start();
        this.currentFuncName = function_name;
        this.currentFuncCode = function_code;
        this._FUNCTION_ID = function_id;
        this.progressService.start();
        this.filteredPhase = [];
        this.filteredPhaseWithName = [];
        console.log(function_id);
        console.log(this.formEditModule.get('moduleIDEdit').value);
        console.log(this.moduleList);
        let module_name;
        let phaseList;
        for(let i=0; i<this.moduleList.length; i++){
            if(this.moduleList[i].module_id == this.formEditModule.get('moduleIDEdit').value){
                console.log("*Module List : ");
                console.log(this.moduleList[i]);
                module_name = this.moduleList[i].module_name;
                this.formEditRow2.get('moduleName').setValue(module_name);
                this.formEditRow2.get('funcName2').setValue(function_name);
                this.formEditRow2.get('fCode2').setValue(function_code);
            }
        }

        //fetch phase based on function ID that has been choosen phaseEditList
        this.updatePhaseList(function_id);

        this.modalService.open(content).result.then((result) => {
            this.progressService.done();
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.progressService.done();
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

    }

    getValue(){
        this.cd.detectChanges();
        return this.flag1;
    }

      public items:Array<string> = [];

      public active:Array<string> = [];

      private value:any = {};
      private _disabledV:string = '0';
      private disabled:boolean = false;

      private get disabledV():string {
        return this._disabledV;
      }

      private set disabledV(value:string) {
        this._disabledV = value;
        this.disabled = this._disabledV === '1';
      }

      public selected(value:any):void {
        console.log('Selected value is: ', value);
      }

      public removed(value:any):void {
        console.log('Removed value is: ', value);
      }

      public typed(value:any):void {
        console.log('New search input: ', value);
      }

      public refreshValue(value:any):void {
        this.value = value;
      }

      editModuleName(){
          this.progressService.start();
          let moduleName2 = this.formEditModule.get('moduleName2').value;
          let moduleIDEdit = this.formEditModule.get('moduleIDEdit').value;
          console.log(moduleName2);
          let sendData = {"module_id":moduleIDEdit, "module_name":moduleName2, "module_code_name":this.currentModuleCode};
          this.http.post(this.UPDATE_MODULE, sendData, this.options)
              .subscribe(params=>{
                    swal(
                        'Good Job!',
                        'Successfully',
                        'success'
                    );

                    //setp 1 upate module data
                    let tmp: any[];
                    this.currentProjectID = this.formDashboard.get('projectID').value;
                    //console.log(currentProjectID);
                    this.moduleList = [];
                    this.http.get(this.GET_MODULE_LIST, this.options)
                        .subscribe(params=>{
                            this.tmp = params.json();
                            //console.log(this.tmp);
                            if(this.tmp != null){
                                for(let i=0; i<this.tmp.length; i++){
                                    if(this.tmp[i].module_project_id == this.currentProjectID){
                                        this.moduleList.push(this.tmp[i]);
                                    }
                                }

                                this.currentModuleName = this.moduleList[0].module_name;
                                this.currentModuleCode = this.moduleList[0].module_code_name;
                                this.formEditModule.get('moduleName2').setValue(this.moduleList[0].module_name);
                                this.formEditModule.get('moduleIDEdit').setValue(this.moduleList[0].module_id);
                                this.formEditModule.get('moduleCode2').setValue(this.moduleList[0].module_code_name);
                                //console.log(this.formEditModule.get('moduleIDEdit').value);

                            }
                        });

                    this.updateViewMoFu();
                    this.progressService.done();
              },
              (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
              });
      }

      editmoduleCode(){
          this.progressService.start();
          let moduleCode2 = this.formEditModule.get('moduleCode2').value;
          let moduleIDEdit = this.formEditModule.get('moduleIDEdit').value;

          let sendData = {"module_id":moduleIDEdit, "module_name":this.currentModuleName, "module_code_name":moduleCode2};
          this.http.post(this.UPDATE_MODULE, sendData, this.options)
              .subscribe(params=>{
                    swal(
                        'Good Job!',
                        'Successfully',
                        'success'
                    );

                    //setp 1 upate module data
                    let tmp: any[];
                    this.currentProjectID = this.formDashboard.get('projectID').value;
                    //console.log(currentProjectID);
                    this.moduleList = [];
                    this.http.get(this.GET_MODULE_LIST, this.options)
                        .subscribe(params=>{
                            this.tmp = params.json();
                            //console.log(this.tmp);
                            if(this.tmp != null){
                                for(let i=0; i<this.tmp.length; i++){
                                    if(this.tmp[i].module_project_id == this.currentProjectID){
                                        this.moduleList.push(this.tmp[i]);
                                    }
                                }

                                this.currentModuleName = this.moduleList[0].module_name;
                                this.currentModuleCode = this.moduleList[0].module_code_name;
                                this.formEditModule.get('moduleName2').setValue(this.moduleList[0].module_name);
                                this.formEditModule.get('moduleIDEdit').setValue(this.moduleList[0].module_id);
                                this.formEditModule.get('moduleCode2').setValue(this.moduleList[0].module_code_name);
                                //console.log(this.formEditModule.get('moduleIDEdit').value);

                            }
                        });

                    this.updateViewMoFu();
                    this.progressService.done();
              },
              (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
              });
      }

      editFunctionName(){
          this.progressService.start();
          let FunctionName2 = this.formEditRow2.get('funcName2').value;
          let sendData = {"function_id":this._FUNCTION_ID, "function_name":FunctionName2, "function_code":this.currentFuncCode};
          this.http.post(this.UPDATE_FUNCTION, sendData, this.options)
              .subscribe(params=>{
                    swal(
                        'Good Job!',
                        'Successfully',
                        'success'
                    );
                    //setp 1 upate module data
                    let tmp: any[];
                    this.currentProjectID = this.formDashboard.get('projectID').value;
                    //console.log(currentProjectID);
                    this.moduleList = [];
                    this.http.get(this.GET_MODULE_LIST, this.options)
                        .subscribe(params=>{
                            this.tmp = params.json();
                            //console.log(this.tmp);
                            if(this.tmp != null){
                                for(let i=0; i<this.tmp.length; i++){
                                    if(this.tmp[i].module_project_id == this.currentProjectID){
                                        this.moduleList.push(this.tmp[i]);
                                    }
                                }

                                this.currentModuleName = this.moduleList[0].module_name;
                                this.currentModuleCode = this.moduleList[0].module_code_name;
                                this.formEditModule.get('moduleName2').setValue(this.moduleList[0].module_name);
                                this.formEditModule.get('moduleIDEdit').setValue(this.moduleList[0].module_id);
                                this.formEditModule.get('moduleCode2').setValue(this.moduleList[0].module_code_name);
                                //console.log(this.formEditModule.get('moduleIDEdit').value);
                                this.getFuncListbyID();

                            }
                        });

                        //update function data
                        this.currentFuncName = this.formEditRow2.get('funcName2').value;
                        this.currentFuncCode = this.formEditRow2.get('fCode2').value;
                        //this._FUNCTION_ID = function_id; ga udah diupdate karena ga berubah, buat jadi patokan
                        this.progressService.start();
                        this.filteredPhase = [];
                        this.filteredPhaseWithName = [];
                        console.log(this._FUNCTION_ID);
                        console.log(this.formEditModule.get('moduleIDEdit').value);
                        console.log(this.moduleList);
                        let module_name;
                        let phaseList;
                        for(let i=0; i<this.moduleList.length; i++){
                            if(this.moduleList[i].module_id == this.formEditModule.get('moduleIDEdit').value){
                                console.log("*Module List : ");
                                console.log(this.moduleList[i]);
                                module_name = this.moduleList[i].module_name;
                                this.formEditRow2.get('moduleName').setValue(module_name);
                                this.formEditRow2.get('funcName2').setValue(this.currentFuncName);
                                this.formEditRow2.get('fCode2').setValue(this.currentFuncCode);
                            }
                        }

                        //fetch phase based on function ID that has been choosen phaseEditList
                        this.updatePhaseList(this._FUNCTION_ID);


                    this.progressService.done();
              },
              (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
              });
      }

      editFunctionCode(){
          this.progressService.start();
          let FunctionCode2 = this.formEditRow2.get('fCode2').value;
          let sendData = {"function_id":this._FUNCTION_ID, "function_name":this.currentFuncName, "function_code":FunctionCode2};
          this.http.post(this.UPDATE_FUNCTION, sendData, this.options)
              .subscribe(params=>{
                    swal(
                        'Good Job!',
                        'Successfully',
                        'success'
                    );

                    //setp 1 upate module data
                    let tmp: any[];
                    this.currentProjectID = this.formDashboard.get('projectID').value;
                    //console.log(currentProjectID);
                    this.moduleList = [];
                    this.http.get(this.GET_MODULE_LIST, this.options)
                        .subscribe(params=>{
                            this.tmp = params.json();
                            //console.log(this.tmp);
                            if(this.tmp != null){
                                for(let i=0; i<this.tmp.length; i++){
                                    if(this.tmp[i].module_project_id == this.currentProjectID){
                                        this.moduleList.push(this.tmp[i]);
                                    }
                                }

                                this.currentModuleName = this.moduleList[0].module_name;
                                this.currentModuleCode = this.moduleList[0].module_code_name;
                                this.formEditModule.get('moduleName2').setValue(this.moduleList[0].module_name);
                                this.formEditModule.get('moduleIDEdit').setValue(this.moduleList[0].module_id);
                                this.formEditModule.get('moduleCode2').setValue(this.moduleList[0].module_code_name);
                                //console.log(this.formEditModule.get('moduleIDEdit').value);
                                this.getFuncListbyID();

                            }
                        });

                        //update function data
                        this.currentFuncName = this.formEditRow2.get('funcName2').value;
                        this.currentFuncCode = this.formEditRow2.get('fCode2').value;
                        //this._FUNCTION_ID = function_id; ga udah diupdate karena ga berubah, buat jadi patokan
                        this.progressService.start();
                        this.filteredPhase = [];
                        this.filteredPhaseWithName = [];
                        console.log(this._FUNCTION_ID);
                        console.log(this.formEditModule.get('moduleIDEdit').value);
                        console.log(this.moduleList);
                        let module_name;
                        let phaseList;
                        for(let i=0; i<this.moduleList.length; i++){
                            if(this.moduleList[i].module_id == this.formEditModule.get('moduleIDEdit').value){
                                console.log("*Module List : ");
                                console.log(this.moduleList[i]);
                                module_name = this.moduleList[i].module_name;
                                this.formEditRow2.get('moduleName').setValue(module_name);
                                this.formEditRow2.get('funcName2').setValue(this.currentFuncName);
                                this.formEditRow2.get('fCode2').setValue(this.currentFuncCode);
                            }
                        }

                        //fetch phase based on function ID that has been choosen phaseEditList
                        this.updatePhaseList(this._FUNCTION_ID);

                    this.progressService.done();
              },
              (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.progressService.done();
              });
      }

      updateDashboard($event){
        this.progressService.start();
        this.filteredPhaseWithName = [];
        let selectData = [];
        let initialProject= [];
        this.http.get(this.PROJECT_DATA_END_POINT, this.options)
            .subscribe(params=>{
                this.projectData = params.json();
                console.log("dashboard data updated : "+$event);

                if(this.projectData != null){
                    for(let i=0; i<this.projectData.length; i++){
                        selectData.push(this.projectData[i].project_name);
                        if(this.projectData[i].project_id == $event){
                            this.formDashboard.get('projectTitle').setValue(this.projectData[i].project_name);
                            this.formDashboard.get('projectID').setValue(this.projectData[i].project_id);
                            this.formDashboard.get('startDate').setValue(this.projectData[i].project_start_date);
                            this.formDashboard.get('endDate').setValue(this.projectData[i].project_end_date);
                            this.dashboarsSer.setSelectBox(this.projectData[i].project_id);
                            this.startDatePro = this.projectData[i].project_start_date;
                            this.endDatePro = this.projectData[i].project_end_date;
                        }
                    }
                } else{
                    this.formDashboard.get('startDate').setValue("yyyy-mm--dd");
                    this.formDashboard.get('endDate').setValue("yyyy-mm--dd");
                }

                    this.items = selectData;
                    initialProject.push(selectData[0]);
                    this.active = initialProject;
                    this.progressService.done();

            });
      }

      changeRowNumber(){
        let newNumRow = this.formNumRow.get('numOfRow').value;
        if(newNumRow == ""){
            swal(
                'Oops...',
                "Row input is required",
                'error'
            );
            this.reloadDataTable();
        } else{
            this.progressService.start();
            this.tglList = [];
            this.monthStart = 999; //start bulan dimulainya projek
            this.monthEnd = 0;
            this.monthLength; //month length terpanjang
            this.monthLengthObject = [];
            this.monthName = [];
            this.startYear = 0; //min
            this.endYear = 0; //max
            this.dayLength = 0;
            this.arrayBatasLoop = [];
            this.cleanArray = [];
            this.dataMaster= [];
            this.batasLoop = this.monthLength;
            this.tmp = [];
            this.dataTable = [];
            this.dataStatistik = [];
            this.dataStatistikModule = [];
            this.tampungStatistikClean = [];
            this.tStatistikModuleClean = [];

            let sendData = {
                "project_id":this.currentProjectID,
                "row_number":Number(newNumRow),
                "page_number":1,
                "filter_search":{}
            }
              let FilterURL = 'https://ayam.localtunnel.me/api/dashboard/get';
              this.http.post(FilterURL, sendData, this.options)
                  .subscribe(params=>{
                      //update table disini
                      let dashboardValue = params.json();
                      console.log("dashboard : ");
                      console.log(dashboardValue.table);
                      this.dataTable = dashboardValue.table;
                      this.dataStatistik.push(dashboardValue.summary.pic);
                      this.dataStatistikModule.push(dashboardValue.summary.module);

                      this.getMonth();
                      this.getTglList();
                      this.getData();

                      let tam;
                      for(let item in this.dataStatistik[0]){
                          if( this.dataStatistik[0].hasOwnProperty(item)) {
                              tam = this.dataStatistik[0];
                              this.tampungStatistikClean.push(tam[item]);
                          }
                      }

                      let tam2;
                      for(let item in this.dataStatistikModule[0]){
                          if(this.dataStatistikModule[0].hasOwnProperty(item)) {
                              tam2 = this.dataStatistikModule[0];
                              this.tStatistikModuleClean.push(tam2[item]);
                          }
                      }
                      this.progressService.done();
                  }, (err)=>{
                    swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                    this.reloadDataTable();
                    this.progressService.done();
                  });
        }
      }

      clearFilter(){
          this.formFilterTable.get('PIC').setValue("");
          this.formFilterTable.get('FuncName').setValue("");
          this.formFilterTable.get('Phase').setValue("");
          this.formFilterTable.get('ModuleName').setValue("");
          this.reloadDataTable();
      }

      filteredByAND(){
        this.progressService.start();
        this.tglList = [];
        this.monthStart = 999; //start bulan dimulainya projek
        this.monthEnd = 0;
        this.monthLength; //month length terpanjang
        this.monthLengthObject = [];
        this.monthName = [];
        this.startYear = 0; //min
        this.endYear = 0; //max
        this.dayLength = 0;
        this.arrayBatasLoop = [];
        this.cleanArray = [];
        this.dataMaster= [];
        this.batasLoop = this.monthLength;
        this.tmp = [];
        this.dataStatistik = [];
        this.tampungStatistikClean = [];
        this.dataStatistikModule = [];
        this.tStatistikModuleClean= [];
        this.functionNameSearch = false;
        this.moduleNameSearch = false;
        this.picSearch = false;
        this.phaseNameSearch = false;

        let functionName = this.formFilterTable.get('FuncName').value;
        let moduleName = this.formFilterTable.get('ModuleName').value;
        let pic = this.formFilterTable.get('PIC').value;
        let phaseName = this.formFilterTable.get('Phase').value;
        let sendData = {
            "project_id":this.currentProjectID,
            "row_number":10,
            "page_number":1,
            "filter_search":{
                "function_name":"",
                "module_name":"",
                "pic":"",
                "phase_name":[]}
        }

        if(functionName!=null){
            sendData.filter_search.function_name = functionName;
            this.functionNameSearch = true;
        }

        if(moduleName!=null){
            sendData.filter_search.module_name = moduleName;
            this.moduleNameSearch = true;
        }

        if(pic!=null){
            sendData.filter_search.pic = pic;
            this.picSearch = true;
        }

        if(phaseName!=null){
            sendData.filter_search.phase_name.push(phaseName);
            this.phaseNameSearch = true;
        }

          let FilterURL = 'https://ayam.localtunnel.me/api/dashboard/get';
          this.http.post(FilterURL, sendData, this.options)
              .subscribe(params=>{
                  //update table disini
                  let dashboardValue = params.json();
                  console.log("dashboard : ");
                  console.log(dashboardValue.table);
                  this.dataTable = dashboardValue.table;
                  this.dataStatistik.push(dashboardValue.summary.pic);
                  this.dataStatistikModule.push(dashboardValue.summary.module);

                  this.countPageDataTable = dashboardValue.page_count*sendData.row_number;
                  this.pageDataTable = 1;
                  this.pageSizeDataTable = sendData.row_number;

                  this.lastDashboardData = sendData;

                  this.getMonth();
                  this.getTglList();
                  this.getData();

                  console.log("dataStatistik : ");
                  console.log(this.dataStatistik[0]);
                  console.log("dataStatistikModule : ");
                  console.log(this.dataStatistikModule[0]);
                  let tam;
                  for(let item in this.dataStatistik[0]){
                      if( this.dataStatistik[0].hasOwnProperty(item)) {
                          tam = this.dataStatistik[0];
                          this.tampungStatistikClean.push(tam[item]);
                      }
                  }

                  let tam2;
                  for(let item in this.dataStatistikModule[0]){
                      if(this.dataStatistikModule[0].hasOwnProperty(item)) {
                          tam2 = this.dataStatistikModule[0];
                          this.tStatistikModuleClean.push(tam2[item]);
                      }
                  }
                  this.progressService.done();
              }, (err)=>{
                swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );
                this.reloadDataTable();
                this.progressService.done();
              });
      }

      //statistic table
      Planned;
      onProgress;
      FEarly;
      FOntime;
      FOverdue;
      Overdue;
      Postponed;
/*
      dataStatistik = [
        {
            "masterdonidonidoni": {
                "name": "masterdonidonidoni",
                "summary": [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1
                ]
            },
            "kapurbarus": {
                "name": "kapurbarus",
                "summary": [
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0
                ]
            }
        }
      ];
 */
/*
      dataStatistikModule = [
          {
              "Module":"Module Pembayaran",
              "Planned":1,
              "onProgress":0,
              "FEarly":1,
              "FOntime":2,
              "FOverdue":3,
              "Overdue":2,
              "Postpone":1
          },
          {
              "Module":"Module Autentikasi",
              "Planned":1,
              "onProgress":0,
              "FEarly":1,
              "FOntime":2,
              "FOverdue":3,
              "Overdue":2,
              "Postpone":1
          },
          {
              "Module":"Module Pembelian",
              "Planned":1,
              "onProgress":0,
              "FEarly":1,
              "FOntime":2,
              "FOverdue":3,
              "Overdue":2,
              "Postpone":1
          },
          {
              "Module":"Module Ekspor",
              "Planned":1,
              "onProgress":0,
              "FEarly":1,
              "FOntime":2,
              "FOverdue":3,
              "Overdue":2,
              "Postpone":1
          },
      ]
 */
/*       sumPlanned(){
          this.Planned = 0;
          for(let i=0; i<this.dataStatistik.length; i++){
              this.Planned = this.Planned + this.dataStatistik[i].Planned;
          }
          return this.Planned;
      }

      sumOnProgress(){
          this.onProgress = 0;
          for(let i=0; i<this.dataStatistik.length; i++){
              this.onProgress = this.onProgress + this.dataStatistik[i].onProgress;
          }
          return this.onProgress;
      }

      sumOfEarly(){
          this.FEarly = 0;
          for(let i=0; i<this.dataStatistik.length; i++){
              this.FEarly = this.FEarly + this.dataStatistik[i].FEarly;
          }
          return this.FEarly;
      }

      sumFontime(){
          this.FOntime = 0;
          for(let i=0; i<this.dataStatistik.length; i++){
              this.FOntime = this.FOntime + this.dataStatistik[i].FOntime;
          }
          return this.FOntime;
      }

      sumFoverdue(){
          this.FOverdue = 0;
          for(let i=0; i<this.dataStatistik.length; i++){
              this.FOverdue = this.FOverdue + this.dataStatistik[i].FOverdue;
          }
          return this.FOverdue;
      }

      sumOverdue(){
          this.Overdue = 0;
          for(let i=0; i<this.dataStatistik.length; i++){
              this.Overdue = this.Overdue + this.dataStatistik[i].Overdue;
          }
          return this.Overdue;
      }

      sumPostponed(){
          this.Postponed = 0;
          for(let i=0; i<this.dataStatistik.length; i++){
              this.Postponed = this.Postponed + this.dataStatistik[i].Postpone;
          }
          return this.Postponed;
      }

      setClickedRow(index){
        this.selectedRow = index;
        console.log(index);
        console.log("selectedRow : "+this.selectedRow);
      } */

      // Pie
      employeeCounter = 0;
      employeeStatistic(length, value){
        this.employeeCounter = this.employeeCounter + 1;
        if(this.employeeCounter <= length){
            console.log("total : "+value);
        }
        return value;
      }
      public pieChartLabels:string[] = ['Planned','On Progress', 'Finished Early', 'Finished On Time', 'Finished On Time', 'Overdue', 'Postponed'];
      public pieChartData:number[] = [300, 500, 100, 300, 500, 100, 100];
      public pieChartType:string = 'doughnut';

      // events
      public chartClicked(e:any):void {
        console.log(e);
      }

      public chartHovered(e:any):void {
        console.log(e);
      }

        setStyles(indeks) {
            let styles;
            if(indeks == 0){
                styles = {
                    // CSS property names
                     'padding-left':892+'px',
                     'width':800+'px',
                     'height':43+'px',
                     'text-align':"center",
                };
            } else{
                styles = {
                    // CSS property names
                     'width':800+'px',
                     'height':43+'px',
                     'text-align':"center",
                };
            }


            return styles;
        }

        setStyles2(indeks) {
            let styles;
                if(indeks == 0){
                    styles = {
                        // CSS property names
                         'padding-left':892+'px',
                         'width':5+'px',
                         'height':44+'px',
                         'text-align':'center',
                    };
                } else{
                    styles = {
                        // CSS property names
                         'padding-left':5+'px',
                         'width':5+'px',
                         'height':44+'px',
                         'text-align':'center',
                    };
                }

            return styles;
        }

        setStyles3(indeks, value_status) {
            let color;
            switch(value_status) {
                case "OFF": {
                   color = '#A2A9AF';
                   break;
                }
                case "PL": {
                   color = '#00A0B0';
                   break;
                }
                case "OP": {
                   color = '#99E3EC';
                   break;
                }
                case "FE": {
                   color = '#BCBD7C';
                   break;
                }
                case "FT": {
                    color = '#93CB9A';
                    break;
                }
                case "FO": {
                    color = '#FF4424';
                    break;
                }
                case "OD": {
                    color = '#FF2F81';
                    break;
                }
                case "PP": {
                    color = '#7B3614';
                    break;
                }
                case "WN": {
                    color = '#F3E88E';
                    break;
                }


             }

            let styles;
                if(indeks == 0){
                    styles = {
                        // CSS property names
                         'padding-left':742+'px',
                         'width':5+'px',
                         'height':60+'px',
                         'text-align':'center',
                         'background-color':color,
                    };
                } else{
                    styles = {
                        // CSS property names
                         'padding-left':5+'px',
                         'width':5+'px',
                         'height':60+'px',
                         'text-align':'center',
                         'background-color':color,
                    };
                }

            return styles;
        }

        style4(value_status){
            switch(value_status) {
                case "OFF": {
                   return "Off";
                }
                case "PL": {
                   return "Planned";
                }
                case "OP": {
                   return "On Progress";
                }
                case "FE": {
                   return "Finished Early";
                }
                case "FT": {
                    return "Finished On Time";
                }
                case "FO": {
                    return "Finished Overdue";
                }
                case "OD": {
                    return "Overdue";
                }
                case "PP": {
                    return "Postponed"
                }
                case "WN": {
                    return "Warning";
                }


             }
        }


    userSearch(page?){
        this.progressService.start();
        let employeeName = this.formSearch.get('employeeName').value;
        let employeeRole = this.formSearch.get('employeeRole').value;
        let roleCode;
        let nowPage = this.page;
        employeeRole = employeeRole.toLowerCase();
        switch(employeeRole){
            case "pm":{
                roleCode = 1;
                break;
            }
            case "sa":{
                roleCode = 2;
                break;
            }
            case "pg":{
                roleCode = 3;
                break;
            }
            default:{
                roleCode = 0;
                break;
            }

        }
        let sendData;
        if((employeeName != "")&&(employeeRole != "")){
            this.isSearchRole = true;
            this.isSearchName = true;
            this.searchName = employeeName;
            this.searchRole = roleCode;
            sendData = {
                "page":1,
                "filter_search":{"role":roleCode,"name":employeeName}
            }
        } else if(employeeName != ""){
            this.isSearchName = true;
            this.searchName = employeeName;
            sendData = {
                "page":1,
                "filter_search":{"name":employeeName}
            }
        } else if(employeeRole != ""){
            this.isSearchRole = true;
            this.searchRole = roleCode;
            sendData = {
                "page":1,
                "filter_search":{"role":roleCode}
            }
        } else{
            this.isSearchRole = false;
            this.isSearchName = false;
            this.searchName = "";
            this.searchRole = "";
            sendData = {
                "page":1,
                "filter_search":{}
            }
        }
        let tmp;
        this.http.post(this.USERMANAGEMENT_SEARCH, sendData, this.options)
            .subscribe(params=>{
                tmp = params.json();
                this.response = tmp.rows;
                this.countPage = tmp.count;
                this.page = 1;
                this.progressService.done();
            });

    }

    searchClear(){
        this.formSearch.get('employeeName').setValue("");
        this.formSearch.get('employeeRole').setValue("");
        let sendData = {
            "page":1,
            "filter_search":{}
        };
        let tmp;
        this.http.post(this.USERMANAGEMENT_SEARCH, sendData, this.options)
        .subscribe(params=>{
            tmp = params.json();
            this.response = tmp.rows;
            this.countPage = tmp.count;
            this.progressService.done();
        });
    }


}













