import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import {NgProgressService} from 'ngx-progressbar';
declare var swal: any;


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent {
    //789456
    data = {
        "username":    "",
        "password":    ""
    };

    dataDecode: any = [];
    response: any = [];
    loader = false;
    wrongPass: boolean = false;
    LOGIN_END_POINT = 'https://ayam.localtunnel.me/api/authenticate';

    constructor(public router: Router, public http:Http, public progressService: NgProgressService) {
    }

    form = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('',Validators.required)
    });

    get username() {
         return this.form.get('username');
    }

    get password() {
        return this.form.get('password');
    }

    ngOnInit(){

    }

    onLoggedin(username, password) {
        this.progressService.start();
        this.data.username = username.value;
        this.data.password = password.value;

        let jwt = new JwtHelper();
        this.http.post(this.LOGIN_END_POINT,this.data)
            .subscribe(param =>{
                this.response = param.json();
                console.log(this.response);
                //loader condition
                this.loader = true;

                if(this.response.status == true){
                    localStorage.setItem('userToken',this.response.token);
                    this.dataDecode = jwt.decodeToken( localStorage.getItem('userToken'));
                    console.log(this.dataDecode);
                    localStorage.setItem('isLoggedin', 'true');
                    localStorage.setItem('userName',this.dataDecode.username);
                    localStorage.setItem('userID',this.dataDecode.id_user);
                    localStorage.setItem('role',this.response.role);//role dalam bentuk angka:string
                    console.log(localStorage.getItem('role'));
                    this.router.navigate(['/blank-page/'+this.dataDecode.username]);
                    this.progressService.done();
                }

            },
            err =>{
                this.wrongPass = true;
                this.progressService.done();
                console.log(err);
            });
    }

}
