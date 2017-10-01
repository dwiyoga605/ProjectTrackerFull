import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { Component, ViewEncapsulation, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgProgressService} from 'ngx-progressbar';
import 'rxjs/add/operator/map';
declare var swal: any;

@Component({
  selector: 'app-phase-detail',
  templateUrl: './phase-detail.component.html',
  styleUrls: ['./phase-detail.component.scss']
})
export class PhaseDetailComponent {
    @Input() phaseID;
    @Input() projectID;
    @Input() type;
    @Input() hyperName;
    @Output() updateDashboard: EventEmitter<any> = new EventEmitter();
    @Output() updatePhaseList: EventEmitter<any> = new EventEmitter();
    phase_status: any;
    list_PG_SA: any;
    statusPhaseDefault: any;
    endCurrentDate: string;
    tmpDateEnd: Date;
    startCurrentDate: string;
    tmpDateStart: Date;
    _editPhasePICID: any;
    closeResult: string;
    phaseID_editPhase;
    flag1;
    phaseDateBool: boolean = false;
    functionID;

    GET_PHASE_LIST = 'https://ayam.localtunnel.me/api/phase';
    GET_LIST_FUNCTION = 'https://ayam.localtunnel.me/api/function';
    GET_MODULE_LIST = 'https://ayam.localtunnel.me/api/module';
    GET_LIST_PHASE_NAME = 'https://ayam.localtunnel.me/api/phasename';
    GET_LIST_PG_SA = 'https://ayam.localtunnel.me/api/phase/pic';
    POST_EDIT_PHASE = 'https://ayam.localtunnel.me/api/phase/edit';

    // add authorization header with jwt token
    headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
    options = new RequestOptions({ headers: this.headers });

    constructor(private modalService: NgbModal,
                  public router: Router,
                  public http: Http,
                  public authHttp: AuthHttp,
                  private cd: ChangeDetectorRef,
                  public progressService: NgProgressService) { }

    formPhaseEdit = new FormGroup({
        moduleName: new FormControl('',Validators.required),
        funcName: new FormControl('',Validators.required),
        phaseName: new FormControl('',Validators.required),
        phaseStatus: new FormControl('',Validators.required),
        PICName: new FormControl('',Validators.required),
        PICID: new FormControl('',Validators.required),
        startDate: new FormControl('',Validators.required),
        endDate: new FormControl('',Validators.required),
        phaseDate: new FormControl('',Validators.required),
        note: new FormControl('',Validators.required)
    });

    public items2:Array<string> = [];
    public active2:Array<string> = [];

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

    get2Value(value){
        this._editPhasePICID = value.id;
        console.log("PIC ID : "+this._editPhasePICID);
        this.flag1 = false;
        this.cd.detectChanges();
        return this.flag1;
    }


    phaseStatusEdit(value){
        console.log(value);
        switch(value) {
           case "Unknown": {
              this.statusPhaseDefault = "0";
              this.phaseDateBool = false;
              this.cd.detectChanges();
              break;
           }
           case "Finished": {
              this.statusPhaseDefault = "1";
              this.phaseDateBool = true;
              this.cd.detectChanges();
              break;
           }
           case "Postpone": {
              this.statusPhaseDefault = "2";
              this.phaseDateBool = true;
              this.cd.detectChanges();
              break;
           }
        }
    }

    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }

    }

    //pas open modal edit phase detail
    phaseUpdate(editPhaseContent){
        this.modalService.open(editPhaseContent).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

        this.flag1 = true;
        this.phaseID_editPhase = this.phaseID;
        let phaseList: any;
        let phaseObject: any;
        let tmpFunc: any;
        let tmpModule: any;
        let moduleObject;
        let funcObject;
        let phaseNameList: any;
        let phaseNameObject: any;
        this.http.get(this.GET_PHASE_LIST, this.options)
            .subscribe(params=>{
                //get phase list
                phaseList = params.json();
                console.log("*Phase List : ");
                console.log(phaseList);
                console.log("*phase id : "+this.phaseID);
                //filter phase list
                if(phaseList!=null){
                    for(let i=0; i<phaseList.length; i++){
                        if(phaseList[i].phase_id == this.phaseID){
                            //get phase single object based on phase_id
                            this._editPhasePICID = phaseList[i].phase_PIC_id;
                            phaseObject = phaseList[i];
                            this.formPhaseEdit.get('note').setValue(phaseObject.phase_note);
                            let dateStringStart: string = phaseObject.phase_start_date.substring(0,10);
                            this.tmpDateStart = new Date(dateStringStart);
                            this.startCurrentDate = this.tmpDateStart.toISOString().slice(0,10).replace(/-/g,"-");

                            let dateStringEnd: string = phaseObject.phase_end_date.substring(0,10);
                            this.tmpDateEnd = new Date(dateStringEnd);
                            this.endCurrentDate = this.tmpDateEnd.toISOString().slice(0,10).replace(/-/g,"-");

                            this.statusPhaseDefault = phaseObject.phase_status;
                            if(phaseObject.phase_finished_flag == true){
                                this.statusPhaseDefault = "1"; //finished status flag
                                this.phaseDateBool = true;
                            } else if(phaseObject.phase_postponed_flag == true){
                                this.statusPhaseDefault = "2"; //postponed status flag
                                this.phaseDateBool = true
                            } else{
                                this.statusPhaseDefault = "0"; //unknown status flag
                                this.phaseDateBool = false;
                            }

                            //backtrack from phase to function
                            this.http.get(this.GET_LIST_FUNCTION, this.options)
                                .subscribe(params=>{
                                    //get function list
                                    tmpFunc = params.json();
                                    console.log("*function list : ");
                                    console.log(tmpFunc);
                                    console.log("*Functionon id : ", phaseObject.phase_function_id);
                                    for(let i=0; i<tmpFunc.length; i++){
                                        if(tmpFunc[i].function_id == phaseObject.phase_function_id){
                                            funcObject = tmpFunc[i];
                                            this.formPhaseEdit.get('funcName').setValue(funcObject.function_name);
                                            this.functionID = funcObject.function_id;
                                            console.log("FUNCTION OBJECT : ");
                                            console.log(funcObject);

                                            //backtrack form function to module
                                            this.http.get(this.GET_MODULE_LIST, this.options)
                                                .subscribe(params=>{
                                                    tmpModule = params.json();

                                                    for(let i=0; i<tmpModule.length; i++){
                                                        if(tmpModule[i].module_id == funcObject.function_module_id){
                                                            moduleObject = tmpModule[i];
                                                            this.formPhaseEdit.get('moduleName').setValue(moduleObject.module_name);
                                                            console.log("MODULE OBJECT : ");
                                                            console.log(moduleObject);

                                                            this.http.get(this.GET_LIST_PHASE_NAME, this.options)
                                                                .subscribe(params=>{
                                                                    phaseNameList = params.json();
                                                                    for(let i=0; i<phaseNameList.length; i++){
                                                                        if(phaseNameList[i].phasename_id == phaseObject.phase_phasename_id){
                                                                            phaseNameObject = phaseNameList[i];
                                                                            console.log("PHASE_NAME OBJECT : ");
                                                                            console.log(phaseNameObject);

                                                                                //get list PIC (SA AND PG LIST)
                                                                                this.http.get(this.GET_LIST_PG_SA, this.options)
                                                                                    .subscribe(params=>{
                                                                                        this.list_PG_SA = params.json();
                                                                                        console.log("LIST PG SA : ");
                                                                                        console.log(this.list_PG_SA);

                                                                                        if(this.list_PG_SA != null){
                                                                                            console.log("FLAG 1");
                                                                                            console.log(phaseObject.phase_PIC_id);
                                                                                            let PG_SA = [];
                                                                                            let PG_SA_ACTIVE = [];
                                                                                            for(let i=0; i<this.list_PG_SA.length; i++){
                                                                                                PG_SA.push({"id":this.list_PG_SA[i].id_user, "text":this.list_PG_SA[i].name+' ('+this.list_PG_SA[i].employee_id+')'});
                                                                                                if(this.list_PG_SA[i].id_user == phaseObject.phase_PIC_id){
                                                                                                    PG_SA_ACTIVE.push({"id":this.list_PG_SA[i].id_user, "text":this.list_PG_SA[i].name+' ('+this.list_PG_SA[i].employee_id+')'});
                                                                                                    this.active2 = PG_SA_ACTIVE;

                                                                                                }
                                                                                            }
                                                                                            this.items2 = PG_SA;
                                                                                        }
                                                                                    });

                                                                            //set to the front end
                                                                            this.formPhaseEdit.get('phaseName').setValue(phaseNameObject.phasename_name);

                                                                            this.phase_status = this.statusPhaseDefault
                                                                            console.log("Phase Status : ");
                                                                            console.log(this.phase_status);

                                                                        }
                                                                    }
                                                                });

                                                    }
                                                    }
                                                });
                                        }
                                    }

                                });



                        }
                    }
                }

            },
            (err)=>{
                 swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );
            });
    }

    ngOnInit(){
        console.log("ngon init phaseID : "+this.phaseID);
    }

    //klik tombol edit pada phase detail
    updatePhaseEdit(){
        let sendData = {
            "phase_id":"",
            "phase_start_date":"",
            "phase_end_date":"",
            "phase_PIC_id":"",
            "phase_status":"",
            "phase_status_date":"",
            "note":""
        };

        sendData.phase_id = this.phaseID_editPhase;
        sendData.phase_status = this.statusPhaseDefault.toString();

        if(this.formPhaseEdit.get('startDate').value == ""){
            sendData.phase_start_date = this.startCurrentDate;
        } else{
            let tmp = this.formPhaseEdit.get('startDate').value;
            let year = tmp.year;
            let month = tmp.month;
            let day = tmp.day;
            sendData.phase_start_date = year+"-"+month+"-"+day;
        }

        if(this.formPhaseEdit.get('endDate').value == ""){
            sendData.phase_end_date = this.endCurrentDate;
        } else{
            let tmp = this.formPhaseEdit.get('endDate').value;
            let year = tmp.year;
            let month = tmp.month;
            let day = tmp.day;
            sendData.phase_end_date = year+"-"+month+"-"+day;
        }

        if(this.formPhaseEdit.get('phaseDate').value == "" || this.phaseDateBool == false){
            sendData.phase_status_date = "";
        } else{
            let tmp = this.formPhaseEdit.get('phaseDate').value;
            let year = tmp.year;
            let month = tmp.month;
            let day = tmp.day;
            sendData.phase_status_date = year+"-"+month+"-"+day;
        }

        sendData.note = this.formPhaseEdit.get('note').value;
        sendData.phase_PIC_id = this._editPhasePICID;
        console.log(sendData.note);
             this.http.post(this.POST_EDIT_PHASE, sendData, this.options)
                .subscribe(params=>{
                    swal(
                        'Good Job!',
                        'Successfully',
                        'success'
                    );

                    this.updateDashboard.emit(this.projectID);
                    this.updatePhaseList.emit(this.functionID);
                },
                (err)=>{
                     swal(
                        'Oops...',
                        err.json().message,
                        'error'
                    );
                });



        console.log(sendData);
    }



}
