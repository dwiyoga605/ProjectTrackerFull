import { DashboardService } from './../dashboard.service';
import { AuthHttp, AUTH_PROVIDERS } from 'angular2-jwt/angular2-jwt';
import { Component, ViewEncapsulation, ChangeDetectorRef, Output, EventEmitter, ViewChild, ViewContainerRef, AfterContentInit, ElementRef} from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgProgressService} from 'ngx-progressbar';
import 'rxjs/add/operator/map'
declare var swal: any;
declare var jQuery: any;

@Component({
  selector: 'app-add-modul',
  templateUrl: './add-modul.component.html',
  styleUrls: ['./add-modul.component.scss']
})
export class AddModulComponent {
  phase_status: number;
  phaseDateBool: boolean = true;
  statusPhaseDefault: number;
  @Output() updateDashboard: EventEmitter<any> = new EventEmitter();
  @ViewChild('aku') akuinput: ElementRef;
  moduleNameData = [];
  FuncList: any;
  response;
  PICUser = [];
  counters = [];
  _MODULE_ID;
  tmpModule;
  countClicked = 0;

  headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
  options = new RequestOptions({ headers: this.headers });

  ADD_MODULE_END_POINT = 'https://ayam.localtunnel.me/api/module/add';
  //related to specific id project
  GET_MODULE_LIST = 'https://ayam.localtunnel.me/api/module';
  POST_NEW_PHASE = 'https://ayam.localtunnel.me/api/function/add';
  UPDATE_MODULE = 'https://ayam.localtunnel.me/api/module/edit';
  DELETE_MODULE = 'https://ayam.localtunnel.me/api/module/delete';
  DELETE_PHASE = 'https://ayam.localtunnel.me/api/phase/delete';

  newPhase =  {
    	  "function_module_id": "",
        "function_name": "" ,
        "function_code": "",
        "function_start_date": "",
        "function_end_date": "",
        "phase_phasename_id": null,
        "phase_start_date": "",
        "phase_end_date": "",
        "phase_PIC_id": null
      }


  currentProjectID: any;
  currentModuleName: string;
  currentModuleID: string;
  currentModuleCodeName: string;
  addPhaseName: string;
  finalFiltered = [];
  updateModulFlag = false;
  phase_id;
  list_PG_SA:any;

  phaseData = [];
  phaseTemplate = {
    "phase_id":"",
    "startDate":"",
    "endDate":"",
    "PIC_id":""
  }

  constructor(
    private modalService: NgbModal,
    public http: Http,
    public dashboardSer: DashboardService,
    public progressService: NgProgressService,
    private cd: ChangeDetectorRef,
    private elementRef: ElementRef) {

  }


    //Input Module
    formAddFunction = new FormGroup({
        functionName: new FormControl('',Validators.required),
        functionCode: new FormControl('',Validators.required),
        functionPhase: new FormControl('',Validators.required),
        startDate1: new FormControl('',Validators.required),
        startDate2: new FormControl('',Validators.required),
        startDate3: new FormControl('',Validators.required),
        endDate1: new FormControl('',Validators.required),
        endDate2: new FormControl('',Validators.required),
        endDate3: new FormControl('',Validators.required),
        PIC1: new FormControl('',Validators.required),
        PIC2: new FormControl('',Validators.required),
        PIC3: new FormControl('',Validators.required),
        newPhase: new FormControl('',Validators.required),
        note: new FormControl('',Validators.required),
        phaseStatus: new FormControl('',Validators.required),
        phaseDate: new FormControl('',Validators.required),
        getPhaseName: new FormControl('',)

    });

    sendData =
        {
            "function_module_id": null,
            "function_name": "",
            "function_code": "",
            "phase_details": [
                {"phase_phasename_id":1, "phase_name":"Design", "phase_PIC_id":null, "phase_start_date":"","phase_end_date":"", "phase_status_date":"", "phase_status":"", "phase_note":"", "flag":true},
                {"phase_phasename_id":2, "phase_name":"Coding", "phase_PIC_id":null, "phase_start_date":"","phase_end_date":"", "phase_status_date":"", "phase_status":"", "phase_note":"", "flag":true},
                {"phase_phasename_id":3, "phase_name":"Testing", "phase_PIC_id":null, "phase_start_date":"","phase_end_date":"", "phase_status_date":"", "phase_status":"", "phase_note":"", "flag":true},
            ]
        };


    pushPhase(phase_id, triggerSource, type?, value?){
      //triggerSource = 1 -> tombol add new phase
      //triggerSource = 0 -> buka dari tombol add new phase
      let phaseName = this.formAddFunction.get('newPhase').value;
      let date;
      let found = false;
      if(type == 1 || type == 2){
        date = value.year+'-'+value.month+'-'+value.day;
      }

      for(let i=0; i<this.sendData.phase_details.length; i++){
        if(this.sendData.phase_details[i].phase_phasename_id == phase_id){
          found = true;
          if(triggerSource == 0){
              if(type == 0){
                //update atribut PIC ID
                this.sendData.phase_details[i].phase_PIC_id = Number(value.id);
              } else if(type == 1){
                //update atribut Start Date
                this.sendData.phase_details[i].phase_start_date = date;
              } else if(type == 2){
                //update atribut End Date
                this.sendData.phase_details[i].phase_end_date = date;
              } else if(type == 3){
                this.sendData.phase_details[i].phase_status = value.id;
              } else if(type == 4){
                this.sendData.phase_details[i].phase_note = value;
              }
          } else{
                swal(
                    'Oops...',
                    'Duplicated phase!',
                    'error'
                );
          }
        }
      }

      if(!found){
          //jika belum ada, tambahkan baru
          this.sendData.phase_details.push({"phase_phasename_id":phase_id, "phase_name":phaseName, "phase_PIC_id":null, "phase_start_date":null,"phase_end_date":null,"phase_status_date":"", "phase_status":"", "phase_note":"", "flag":true});
      }
      console.log(this.sendData);
    }

    deleteDOM(phase_id){
      console.log("value : "+phase_id);
      for(let i=0; i<this.sendData.phase_details.length; i++){
        if(this.sendData.phase_details[i].phase_phasename_id == phase_id){
          this.sendData.phase_details.splice(i,1);
          console.log("nilai i : "+i);
        }
      }

      console.log(this.sendData);
    }

    getIDNewPhase() {
        //BACKEND HARUS ADA FUNGSI PENGECEKAN
        //JIKA NAMA SUDAH ADA DIDATABASE (ID FASE YG BARU DITAMBAHKAN SUDAH ADA) MAKA BACKEND RETURN ID PHASE NYA
        //JIKA NAMA BELUM ADA DI DATABASE MAKA BACKEND CREATE NEW ROW LALU RETURN ID NYA
        this.progressService.start();
        let newPhaseName = this.formAddFunction.get('newPhase').value;
        let GET_ID_NEW_PHASE = 'https://ayam.localtunnel.me/api/phase/add';

        //data
        let getIDTemplate:any = {"phasename_name": newPhaseName};
        let tmp: any;
        // get users from api
        this.http.post(GET_ID_NEW_PHASE, getIDTemplate, this.options)
            .subscribe(params=>{
                //tangkap id-nya lalu panggil fungsi pushPhase(params.nilainya,1)
                //pakai nilai parameter triggerSource = 1
                //passing idnya ke pushPhase(tulis idnya)
                tmp = params.json();
                this.pushPhase(tmp.phase_phasename_id,1);
                //console.log(params.json());
                this.progressService.done();
            });
    }

    postToServer(){
        this.progressService.start();
        this.sendData.function_name = this.formAddFunction.get('functionName').value;
        this.sendData.function_code = this.formAddFunction.get('functionCode').value;
        let ADD_FUNCTION_END_POINT = 'https://ayam.localtunnel.me/api/function/add';
        console.log(this.sendData);

        // get users from api
        this.http.post(ADD_FUNCTION_END_POINT, this.sendData, this.options)
            .subscribe(params=>{
              console.log(params.json());
                swal(
                    'Good Job!',
                    'Add function successfully',
                    'success'
                );
                this.updateDashboard.emit(this.currentProjectID);
                this.formAddFunction.get("functionName").setValue("");
                this.formAddFunction.get("functionCode").setValue("");
                this.formAddFunction.get("note").setValue("");
                this.filteredFunction(this._MODULE_ID);
                this.moduleNameData = [];

                this.http.get(this.GET_MODULE_LIST, this.options)
                  .subscribe(params=>{
                      this.response = params.json();
                      //console.log(this.response);
                      for(let i=0; i<this.response.length; i++){
                        if(this.response[i].module_project_id == this.currentProjectID){
                          //console.log("flag 1");
                          this.moduleNameData.push(this.response[i]);
                        }
                      }
                      //console.log(this.response);
                      this.updateDashboard.emit(this.currentProjectID);
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


  open(content) {
    this.progressService.start();
    this.progressService.start();
    this.currentProjectID = this.dashboardSer.getSelectBox();
    //console.log(this.dashboardSer.getSelectBox());
    this.moduleNameData = [];

    this.http.get(this.GET_MODULE_LIST, this.options)
      .subscribe(params=>{
          this.response = params.json();
          //console.log(this.response);
          for(let i=0; i<this.response.length; i++){
            if(this.response[i].module_project_id == this.currentProjectID){
              //console.log("flag 1");
              this.moduleNameData.push(this.response[i]);
            }
          }
          //console.log(this.response);
          this.progressService.done();
      });
    console.log(this.moduleNameData);
    this.modalService.open(content);
    this.progressService.done();
  }

  private getDismissReason(reason: any): string {
    this.progressService.done();
    if (reason === ModalDismissReasons.ESC) {
      this.progressService.done();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.progressService.done();
      return 'by clicking on a backdrop';
    } else {
      this.progressService.done();
      return  `with: ${reason}`;
    }
  }

    //Input Module
    formAddModule = new FormGroup({
        moduleName: new FormControl('',Validators.required),
        moduleCode: new FormControl('',Validators.required)
    });

    addModule(moduleName, moduleCode) {
        //type 1 = add
        //type 2 = update/edit
          this.progressService.start();
          this.moduleNameData.push({"module_project_id":this.currentProjectID,"module_name":moduleName.value,"module_code_name":moduleCode.value});
          //console.log(this.moduleNameFake);
          let send = {"module_project_id":this.currentProjectID,"module_name":moduleName.value,"module_code_name":moduleCode.value};
          this.moduleNameData = [];
          this.http.post(this.ADD_MODULE_END_POINT, send, this.options)
              .subscribe(params=>{
                  swal(
                      'Good Job!',
                      'it has been added',
                      'success'
                  );
                  this.formAddModule.get('moduleName').setValue("");
                  this.formAddModule.get('moduleCode').setValue("");

                  this.http.get(this.GET_MODULE_LIST, this.options)
                    .subscribe(params=>{
                        this.response = params.json();
                        //console.log(this.response);
                        for(let i=0; i<this.response.length; i++){
                          if(this.response[i].module_project_id == this.currentProjectID){
                            //console.log("flag 1");
                            this.moduleNameData.push(this.response[i]);
                          }
                        }
                        //console.log(this.response);
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

    editModule(module_id?, module_name?, module_code?){
      this.progressService.start();
      if(this.countClicked == 0){
        this.tmpModule = module_id;
        this.updateModulFlag = true;
        this.countClicked = this.countClicked + 1;
        this.formAddModule.get('moduleName').setValue(module_name);
        this.formAddModule.get('moduleCode').setValue(module_code);
        this.cd.detectChanges();
        this.progressService.done();
      } else{
        this.moduleNameData = [];
        this.countClicked = 0;
        this.updateModulFlag = false;
        this.cd.detectChanges();
        let moduleName = this.formAddModule.get('moduleName').value;
        let moduleCode = this.formAddModule.get('moduleCode').value;
        let sendData = {"module_id":this.tmpModule, "module_name":moduleName, "module_code_name":moduleCode};
        this.progressService.done();
        this.http.post(this.UPDATE_MODULE, sendData, this.options)
            .subscribe(params=>{
                swal(
                    'Good Job!',
                    'Add function successfully',
                    'success'
                );
                this.formAddModule.get('moduleName').setValue("");
                this.formAddModule.get('moduleCode').setValue("");

                this.http.get(this.GET_MODULE_LIST, this.options)
                  .subscribe(params=>{
                      this.response = params.json();
                      //console.log(this.response);
                      for(let i=0; i<this.response.length; i++){
                        if(this.response[i].module_project_id == this.currentProjectID){
                          //console.log("flag 1");
                          this.moduleNameData.push(this.response[i]);
                        }
                      }
                      //console.log(this.response);
                  });

            },
            (err)=>{
                 swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );
                this.formAddModule.get('moduleName').setValue("");
                this.formAddModule.get('moduleCode').setValue("");
                this.updateModulFlag = false;
                this.cd.detectChanges();

                this.http.get(this.GET_MODULE_LIST, this.options)
                  .subscribe(params=>{
                      this.response = params.json();
                      //console.log(this.response);
                      for(let i=0; i<this.response.length; i++){
                        if(this.response[i].module_project_id == this.currentProjectID){
                          //console.log("flag 1");
                          this.moduleNameData.push(this.response[i]);
                        }
                      }
                      //console.log(this.response);
                  });
            });
      }
    }

    filteredFunction(moduleID){
      this.progressService.start();
      this.finalFiltered = [];
      let GET_LIST_PG_SA = 'https://ayam.localtunnel.me/api/phase/pic';
      let GET_FUNCTION_LIST = 'https://ayam.localtunnel.me/api/function';
      let GET_PHASE_LIST = 'https://ayam.localtunnel.me/api/phase';
      let GET_PHASE_CODE ='https://ayam.localtunnel.me/api/phasename';
      let headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
      let options = new RequestOptions({ headers: headers });

      let listAllFunction;
      let listAllPhase;
      let filteredFunction = [];
      let phaseCodeList;
      let PG_SA = [];

      //status for selectbox status
      let statusItem = [];
      statusItem = [{"id":"1", "text":"unknown"}, {"id":"2", "text":"Finished"}, {"id":"3", "text":"postpone"}];
      this.itemsStatus = statusItem;

        // get users from api
        this.http.get(GET_LIST_PG_SA, options)
            .subscribe(params=>{
                this.list_PG_SA = params.json();
                console.log("list PG SA");
                console.log(this.list_PG_SA);
                if(this.list_PG_SA!=null){
                  for(let i=0; i<this.list_PG_SA.length; i++){
                    PG_SA.push({"id":this.list_PG_SA[i].id_user,"text":this.list_PG_SA[i].name+' ('+this.list_PG_SA[i].employee_id+')'});
                  }
                  this.items = PG_SA;
                  console.log(this.items);
                }

            });

        //FETCH FUNCTION LIST (PHASE INCLUDED) FOR LIST IN ADD PHASE OF FUNCTION

        //First get function list
        this.http.get(GET_FUNCTION_LIST, options)
            .subscribe(params=>{
                listAllFunction = params.json();

                //second, filter function by module ID
                for(let i=0; i<listAllFunction.length; i++){
                  if(listAllFunction[i].function_module_id == moduleID){
                      filteredFunction.push(listAllFunction[i]);
                  }
                }
            });

        //third get phase list
        this.http.get(GET_PHASE_LIST, options)
            .subscribe(params=>{
                listAllPhase = params.json();
                console.log("list all phase");
                console.log(listAllPhase);


            this.http.get(GET_PHASE_CODE, options)
                .subscribe(params=>{
                    phaseCodeList = params.json();
                    console.log("list phase code");
                    console.log(phaseCodeList);

                    for(let i=0; i<filteredFunction.length; i++){
                      for(let j=0; j<listAllPhase.length; j++){
                        if(filteredFunction[i].function_id == listAllPhase[j].phase_function_id){
                            for(let k=0; k<phaseCodeList.length; k++){
                              if(phaseCodeList[k].phasename_id == listAllPhase[j].phase_phasename_id){
                                this.finalFiltered.push({
                                  "function_name":filteredFunction[i].function_name,
                                  "function_code":filteredFunction[i].function_code,
                                  "Phase":phaseCodeList[k].phasename_name,
                                  "phase_id":listAllPhase[j].phase_id
                              })
                              }
                            }
                        }
                      }
                    }

                    this.progressService.done();
                });

            });
    }

    addFunction(content, moduleName, moduleCode, moduleID) {
      this.finalFiltered = [];
      //reset modal
      this.sendData =
          {
              "function_module_id": null,
              "function_name": "",
              "function_code": "",
              "phase_details": [
                  {"phase_phasename_id":1, "phase_name":"Design", "phase_PIC_id":null, "phase_start_date":"","phase_end_date":"", "phase_status_date":"", "phase_status":"", "phase_note":"", "flag":true},
                  {"phase_phasename_id":2, "phase_name":"Coding", "phase_PIC_id":null, "phase_start_date":"","phase_end_date":"", "phase_status_date":"", "phase_status":"", "phase_note":"", "flag":true},
                  {"phase_phasename_id":3, "phase_name":"Testing", "phase_PIC_id":null, "phase_start_date":"","phase_end_date":"", "phase_status_date":"", "phase_status":"", "phase_note":"", "flag":true},
              ]
          };

      this.formAddFunction.get('functionName').setValue("");
      this.formAddFunction.get('functionCode').setValue("");
      this._MODULE_ID = moduleID;
      this.currentModuleName = moduleName;
      this.currentModuleCodeName = moduleCode;
      this.sendData.function_module_id = moduleID;
      console.log("Module ID 1 : "+this.sendData.function_module_id);
      console.log("Module ID 2 : "+this._MODULE_ID);
      this.filteredFunction(moduleID);
      this.modalService.open(content);
    }

      public items:Array<string> = [];
      public active:Array<string> = [];

      public itemsStatus:Array<string> = [];
      public activeStatus:Array<string> = [];

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

      deleteModule(module_id){
        this.progressService.start();
        this.moduleNameData = [];
        let sendData = {"module_id":module_id};

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
        this.http.post(this.DELETE_MODULE, sendData, this.options)
          .subscribe(params=>{
              swal(
                'Good Job!',
                'Successfully',
                'success'
            );
            this.updateDashboard.emit(this.currentProjectID);
            this.http.get(this.GET_MODULE_LIST, this.options)
              .subscribe(params=>{
                  this.response = params.json();
                  //console.log(this.response);
                  for(let i=0; i<this.response.length; i++){
                    if(this.response[i].module_project_id == this.currentProjectID){
                      //console.log("flag 1");
                      this.moduleNameData.push(this.response[i]);
                    }
                  }
                  //console.log(this.response);

                  this.updateDashboard.emit(this.currentProjectID);
                  this.progressService.done();
              });

          },
          (err)=>{
                 swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );

              this.http.get(this.GET_MODULE_LIST, this.options)
                .subscribe(params=>{
                    this.response = params.json();
                    //console.log(this.response);
                    for(let i=0; i<this.response.length; i++){
                      if(this.response[i].module_project_id == this.currentProjectID){
                        //console.log("flag 1");
                        this.moduleNameData.push(this.response[i]);
                      }
                    }
                    //console.log(this.response);
                    this.progressService.start();
                });
          });
        })

      }

      deletePhase(phase_id){
        this.progressService.start();
        let sendDetail = {"phase_id":phase_id};
        swal({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(params=>{
            this.http.post(this.DELETE_PHASE, sendDetail, this.options)
              .subscribe(params=>{
                  swal(
                    'Good Job!',
                    'Successfully',
                    'success'
                );

                //update view list
                this.filteredFunction(this._MODULE_ID);
                this.updateDashboard.emit(this.currentProjectID);
                this.progressService.done();
              },
              (err)=>{
                 swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );
                //update view list
                this.filteredFunction(this._MODULE_ID);
                this.progressService.done();
              });
        });

      }

      finPosDate(index, dateObject){
        let date = dateObject._model
        this.sendData.phase_details[index].phase_status_date = date.year+"-"+date.month+"-"+date.day;
      }

      finishStatus(value, index){
        console.log(value);
        switch(value) {
           case "Unknown": {
              this.phase_status = 1;
              this.sendData.phase_details[index].phase_status = "1";
              this.sendData.phase_details[index].flag = true;
              this.cd.detectChanges();
              break;
           }
           case "Finished": {
              this.phase_status = 2;
              this.sendData.phase_details[index].phase_status = "2";
              this.sendData.phase_details[index].flag = null;
              this.cd.detectChanges();
              break;
           }
           case "Postpone": {
              this.phase_status = 3;
              this.sendData.phase_details[index].phase_status = "3";
              this.sendData.phase_details[index].flag = null;
              this.cd.detectChanges();
              break;
           }
        }
      }


}
