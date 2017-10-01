import { tokenNotExpired, JwtHelper, AuthHttp } from 'angular2-jwt';
import { Component, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgProgressService} from 'ngx-progressbar';
import { FileUploader } from 'ng2-file-upload';
import 'rxjs/add/operator/map'
declare var swal: any;

// const URL = '/api/';
const URL = 'https://ayam.localtunnel.me/api/project/upload';


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})

export class AddProjectComponent {
  @Output() change = new EventEmitter();
  closeResult: string;
  model: any;
  modalReference: NgbModalRef;

  public uploader:FileUploader = new FileUploader({
    url: URL,
    authToken: localStorage.getItem('userToken'),
    itemAlias:'project_file'
  });

  isAddedFile = false;
  fileAddedData;
  toggleUpload = true;

  // add authorization header with jwt token
  headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
  options = new RequestOptions({ headers: this.headers });

  constructor(private modalService: NgbModal, public router: Router, public http: Http, public authHttp: AuthHttp, public progressService: NgProgressService) {
      this.toggleUpload = true;
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
            if(this.toggleUpload != false){
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
                'File extension must be (.xlsx)',
                'error'
            );
            this.toggleUpload = false;
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
                'File extension must be (.xlsx)',
                'error'
            );
        } else{
            this.progressService.start();
        }

    }
}

  open(content) {
    this.modalReference = this.modalService.open(content);
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

    //ADD PROJECT FORM
    formAddProject = new FormGroup({
        projectName: new FormControl('',Validators.required),
        startDate: new FormControl('',Validators.required),
        endDate: new FormControl('',Validators.required),
        clientName: new FormControl('',Validators.required),
        clientAddress: new FormControl('',Validators.required),
        clientPhone: new FormControl('',Validators.required),
        clientEmail: new FormControl('',Validators.compose([Validators.required, Validators.email])),
        attachModule: new FormControl('',)
    });

    ADD_PROJECT_POINT = 'https://ayam.localtunnel.me/api/project/add';
    PROJECT_DATA_END_POINT = 'https://ayam.localtunnel.me/api/project';

    data = {
        "project_name":"",
        "project_client_name":"",
        "project_client_address":"",
        "project_client_phone":"",
        "project_client_email":"",
        "project_manager_id":"" //untuk kasus PM id-nya diambil dari milik dia (decode JWT), tapi kalau admin bisa milih id-PM (artinya form add project ada tambahan 1 select box)
    };

    addProject() {
        this.progressService.start();
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
        let options = new RequestOptions({ headers: headers });
        let jwt = new JwtHelper();
        let decodeData = jwt.decodeToken( localStorage.getItem('userToken'));
        let selectData = [];
        let initialProject= [];

        this.data.project_name = this.formAddProject.get('projectName').value;

/*      let start = this.formAddProject.get('startDate').value;
        this.data.project_start_date = start.year+'-'+start.month+'-'+start.day;

        let end = this.formAddProject.get('endDate').value;
        this.data.project_end_date = end.year+'-'+end.month+'-'+end.day;*/

        this.data.project_client_name = this.formAddProject.get('clientName').value;
        this.data.project_client_address = this.formAddProject.get('clientAddress').value;
        this.data.project_client_phone = this.formAddProject.get('clientPhone').value;
        this.data.project_client_phone = this.data.project_client_phone.toString();
        this.data.project_client_email = this.formAddProject.get('clientEmail').value;

        this.data.project_manager_id = decodeData.id_user;
        console.log(decodeData.id_user);

        this.http.post(this.ADD_PROJECT_POINT, this.data, options)
            .subscribe(params=>{
              this.change.emit();
                swal(
                    'Good Job!',
                    'New project has been added',
                    'success'
                );

                //set to default
                this.formAddProject.get('projectName').setValue("");
                this.formAddProject.get('clientName').setValue("");
                this.formAddProject.get('clientAddress').setValue("");
                this.formAddProject.get('clientPhone').setValue("");
                this.formAddProject.get('clientEmail').setValue("");
                this.modalReference.dismiss();
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

}
