import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var swal: any;

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    //form flags
    userAlreadyReg: boolean = false; //checkUsername()
    employeeAlready: boolean = false;
    accountSucc: boolean = false;
    passMatch: boolean = false; //checkPassMatch()
    confirm: boolean = false;

    SIGNUP_END_POINT = 'https://ayam.localtunnel.me/api/signup';
    data = {
        "name":    "",
        "username":    "",
        "employee_id":  "",
        "password":    "",
        "confirm_password":    "",
        "role":        ""
    };

    response: any = [];

    constructor(public router: Router, public http: Http) { }

    forms = new FormGroup({
        fullName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])),
        username: new FormControl('',Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])),
        employeeId: new FormControl('',Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])),
        password: new FormControl('',Validators.compose([Validators.required, Validators.minLength(8)])),
        confirmPass: new FormControl('',Validators.required),
        role: new FormControl('',Validators.required)
    });

    checkPassMatch() {
        //cek pass dan confirm pass di form apakah sudah sama
    }

    checkUsername(){
        //cek username sudah ada apa blm di database
    }

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
                      'Please login!',
                      'success'
                    );
                    this.router.navigate(['/login']);
                }
            },

            (err)=>{
                    this.response = err.json();
                    console.log(this.response);
                    if(this.response.message[0].message == "username must be unique"){
                        //alert('Username already exists!');
                        //this.userAlreadyReg = true;
                        swal(
                          'Sorry',
                          'Username already exists!',
                          'error'
                        );
                    } else if(this.response.message[0].message == "employee_id must be unique"){
                        //alert('Employee ID already exists!');
                        //this.employeeAlready = true;
                        swal(
                          'Sorry',
                          'Employee ID already exists!',
                          'error'
                        );
                    }
            });

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
