import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { Component, ViewEncapsulation, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgProgressService} from 'ngx-progressbar';
import 'rxjs/add/operator/map';
declare var swal:any;

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {
  //form flags
  userAlreadyReg: boolean = false; //checkUsername()
  employeeAlready: boolean = false;
  accountSucc: boolean = false;
  passMatch: boolean = false; //checkPassMatch()
  confirm: boolean = false;
  closeResult: string;
  modalReference: NgbModalRef;
  @Output() updateMan : EventEmitter<any> = new EventEmitter();

  SIGNUP_END_POINT = 'https://ayam.localtunnel.me/api/signup';
  data = {
      "name":    "",
      "username":    "",
      "employee_id":  "",
      "password":    "",
      "confirm_password": "",
      "role":        ""
  };

  response: any = [];

    constructor(private modalService: NgbModal, public http: Http) {}

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

    forms = new FormGroup({
      fullName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      username: new FormControl('',Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])),
      employeeId: new FormControl('',Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])),
      password: new FormControl('',Validators.compose([Validators.required, Validators.minLength(8)])),
      confirmPass: new FormControl('',Validators.required),
      role: new FormControl('',Validators.required)
  });

  onSignUp(fullN, userN, employeeI, pass, role, confirm_password ) {
    this.data.name = fullN.value;
    this.data.username = userN.value;
    this.data.employee_id = employeeI.value;
    this.data.password = pass.value;
    this.data.confirm_password = confirm_password.value;
    let tmp = role.value;

    if(tmp == "PG") {
        this.data.role = "3";
    } else if(tmp == "SA") {
        this.data.role = "2";
    } else if(tmp == "PM") {
        this.data.role = "1";
    }

    //refresh condition
    this.userAlreadyReg = false;
    this.employeeAlready = false;
    this.accountSucc = false;

    this.http.post(this.SIGNUP_END_POINT,this.data)
        .subscribe(param=>{
            this.response = param.json();
            console.log(this.response);
            if(this.response.status == true) {
                //alert('Account created, please login');
                //this.accountSucc = true;
                swal(
                  'Account created',
                  '',
                  'success'
                );
                this.updateMan.emit();
                this.modalReference.dismiss();
                this.forms.get('fullName').setValue("");
                this.forms.get('username').setValue("");
                this.forms.get('employeeId').setValue("");
                this.forms.get('password').setValue("");
                this.forms.get('confirmPass').setValue("");

            }
        },

        (err)=>{
                this.response = err.json();
                console.log(this.response);
                swal(
                  'Sorry',
                  this.response.message,
                  'error'
                );
        });

  }

  clear(){
    this.forms.get('fullName').setValue("");
    this.forms.get('username').setValue("");
    this.forms.get('employeeId').setValue("");
    this.forms.get('password').setValue("");
    this.forms.get('confirmPass').setValue("");
  }

  get fullName() {
      return this.forms.get('fullName');
  }

  get username() {
     return this.forms.get('username');
  }

  get employeeId() {
      return this.forms.get('employeeId');
  }

  get password() {
     return this.forms.get('password');
  }

  get confirmPass() {
      return this.forms.get('confirmPass');
  }

  get role() {
      return this.forms.get('role');
  }

  ngOnInit() {
    //default value to select role
    this.forms.get('role').setValue("PM");
  }

  confirmPassword(value){
    if(value != this.password.value){
        this.confirm = true;
    } else{
        this.confirm = false;
    }
}

}
