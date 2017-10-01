import { NgProgressService } from 'ngx-progressbar';
import { DashboardService } from './../dashboard.service';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import 'rxjs/add/operator/map'
declare var swal: any;

// const URL = '/api/';
const URL = 'https://ayam.localtunnel.me/api/design/upload';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {
  @Input() moduleName;
  @Input() funcName;
  @Input() phaseID;
  @Input() phaseStart;
  @Input() phaseEnd;
  @Input() phaseName;
  @Input() type;
  @Input() buttonName;
  @Input() projectGlobalName;
  @Output() phase : EventEmitter<any> = new EventEmitter();

  POST_CHECK_LIST = 'https://ayam.localtunnel.me/api/checklist/checked ';
  GET_CHECKLIST_BYPHASEID = 'https://ayam.localtunnel.me/api/checklist/getbyid';
  UNCHECKED = 'https://ayam.localtunnel.me/api/checklist/unchecked';
  checklistData: any;
  // add authorization header with jwt token
  headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
  options = new RequestOptions({ headers: this.headers });
  closeResult: string;
  startCurrentDate;
  endCurrentDate;
  percentage = 0;
  checkedCount = 0;
  isAddedFile = false;
  fileAddedData;
  toggle = true;
  ROLE;

  public uploader:FileUploader = new FileUploader({
      url: URL,
      authToken: localStorage.getItem('userToken'),
      itemAlias:'design_file'
    });
  constructor(private modalService: NgbModal, private http: Http, public progressService: NgProgressService) {
      this.ROLE = localStorage.getItem('role');
      this.toggle = true;
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        console.log("ImageUpload:uploaded:", item, status);
        if(item.isSuccess){
            swal(
                'Good Job!',
                'Successfully',
                'success'
            );
            this.progressService.done();
        } else if(item.isError){
            if(this.toggle != false){
                swal(
                  'Oops...',
                  'Failed to upload',
                  'error'
              );
            }
            this.progressService.done();
        }

    };

    this.isAddedFile =false;
    this.uploader.onAfterAddingFile = (file)=> {
        console.log(file);
        this.fileAddedData = file;
        if(file.file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            swal(
                'Oops...',
                'Prohibited file format',
                'error'
            );
            this.toggle = false;
        }
        file.withCredentials = false;
        this.isAddedFile = true;
    };

}

  isAddedFileUpload(){
    console.log("upload masuk");
    if(this.isAddedFile == false){
        swal(
            'Oops...',
            'There is no file',
            'error'
        );
    } else{
        if(this.fileAddedData.file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            swal(
                'Oops...',
                'Prohibited file format',
                'error'
            );
        } else{
            this.progressService.start();
        }

    }
  }

  updateDataChecklist(){
    let sendData = {
      "phase_id": this.phaseID
    };
    let checklistTmp;
    //get checklist list based on phaseID that was clicked by user
    this.http.post(this.GET_CHECKLIST_BYPHASEID, sendData, this.options)
        .subscribe(params=>{
            checklistTmp = params.json();
            this.checklistData = checklistTmp.checklists;
            console.log("checklist data :");
            console.log(this.checklistData);
            if(this.checklistData!=null){
              //update percentage
              this.percentage = 0;
              this.checkedCount = 0;
              for(let i=0; i<this.checklistData.length; i++){
                  if(this.checklistData[i].checklist_status == 1){
                    this.checkedCount = this.checkedCount + 1;
                  }
              }
              console.log("checked count : "+this.checkedCount);
              //calculate percentage
              this.percentage = Math.floor((this.checkedCount/this.checklistData.length)*100);
              this.phase.emit();
            }
        });

  }


  checked(value, checklist_id, checklist_status){
    let jwt = new JwtHelper();
    let dataDecode = jwt.decodeToken( localStorage.getItem('userToken'));
    let userID = dataDecode.id_user;
    let sendData = {"checklist_id":checklist_id};
    let sendData_unchecked = {"checklist_id":checklist_id};
    let sendData2 = {
      "phase_id": this.phaseID
    };

    let checklistTmp;
    if(checklist_status == 0){
      //unchecked to checked
      this.http.post(this.POST_CHECK_LIST, sendData, this.options)
          .subscribe(params=>{
                swal(
                    'Good Job!',
                    'Successfully',
                    'success'
                );

                //get checklist list based on phaseID that was clicked by user
                this.http.post(this.GET_CHECKLIST_BYPHASEID, sendData2, this.options)
                    .subscribe(params=>{
                        let checklistTmp = params.json();
                        this.checklistData = checklistTmp.checklists;
                        if(this.checklistData!=null){
                          //update percentage
                          this.percentage = 0;
                          this.checkedCount = 0;
                          for(let i=0; i<this.checklistData.length; i++){
                              if(this.checklistData[i].checklist_status == 1){
                                this.checkedCount = this.checkedCount + 1;
                              }
                          }
                          console.log("checked count : "+this.checkedCount);
                          //calculate percentage
                          this.percentage = Math.floor((this.checkedCount/this.checklistData.length)*100);
                          this.phase.emit();
                        }
                    });

          },
          (err)=>{
                 swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );
          });

    } else if(checklist_status == 1){
      console.log("FLGA 1");
      //checked to unchecked
      this.http.post(this.UNCHECKED, sendData_unchecked, this.options)
          .subscribe(params=>{
                swal(
                    'Good Job!',
                    'Successfully',
                    'success'
                );

                //get checklist list based on phaseID that was clicked by user
                this.http.post(this.GET_CHECKLIST_BYPHASEID, sendData2, this.options)
                    .subscribe(params=>{
                        checklistTmp = params.json();
                        this.checklistData = checklistTmp.checklists;
                        if(this.checklistData!=null){
                          //update percentage
                          this.percentage = 0;
                          this.checkedCount = 0;
                          for(let i=0; i<this.checklistData.length; i++){
                              if(this.checklistData[i].checklist_status == 1){
                                this.checkedCount = this.checkedCount + 1;
                              }
                          }
                          console.log("checked count : "+this.checkedCount);
                          //calculate percentage
                          this.percentage = Math.floor((this.checkedCount/this.checklistData.length)*100);
                          this.phase.emit();
                        }

                    });

          },
          (err)=>{
                 swal(
                    'Oops...',
                    err.json().message,
                    'error'
                );
          });
    }
  }

  ngOnInit(){
    console.log("project global name : "+this.projectGlobalName);
  }

  open(content) {
    this.formChecklist.get('moduleName3').setValue(this.moduleName);
    this.formChecklist.get('funcName3').setValue(this.funcName);
    this.formChecklist.get('phaseName').setValue(this.phaseName);
    this.formChecklist.get('startDate').setValue(this.phaseStart);
    this.formChecklist.get('endDate').setValue(this.phaseEnd);
    this.formChecklist.get('projectName').setValue(this.projectGlobalName);

    let sendData = {
      "phase_id": this.phaseID
    };
    this.checkedCount = 0;
    this.percentage = 0;
    let checklistTmp;
    //get checklist list based on phaseID that was clicked by user
    this.http.post(this.GET_CHECKLIST_BYPHASEID, sendData, this.options)
        .subscribe(params=>{
            checklistTmp = params.json();
            this.checklistData = checklistTmp.checklists;
            console.log("checklist data :");
            console.log(this.checklistData);
              if(this.checklistData!=null){
                //update percentage
                for(let i=0; i<this.checklistData.length; i++){
                    if(this.checklistData[i].checklist_status == 1){
                      this.checkedCount = this.checkedCount + 1;
                    }
                }
                console.log("checked count : "+this.checkedCount);
                //calculate percentage
                this.percentage = Math.floor((this.checkedCount/this.checklistData.length)*100);
              }

        });

    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  formChecklist = new FormGroup({
      moduleName3: new FormControl('',Validators.required),
      funcName3: new FormControl('',Validators.required),
      phaseName: new FormControl('',Validators.required),
      startDate: new FormControl('',Validators.required),
      endDate: new FormControl('',Validators.required),
      projectName: new FormControl('',Validators.required),
  });

}
