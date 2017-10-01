import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { Component, ViewEncapsulation, Input, Output, ChangeDetectorRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgProgressService} from 'ngx-progressbar';
import 'rxjs/add/operator/map';
declare var swal: any;

@Component({
  selector: 'app-off-date',
  templateUrl: './off-date.component.html',
  styleUrls: ['./off-date.component.scss']
})
export class OffDateComponent {
  closeResult: string;
  DateTemplate: any = {
    "custom_start_date": "" ,
    "custom_end_date": "" ,
    "custom_status": null ,
    "custom_note": "" };

  DATE = 'https://ayam.localtunnel.me/api/customdate/get';
  DATE_ADD = 'https://ayam.localtunnel.me/api/customdate/add';
  DATE_DELETE = 'https://ayam.localtunnel.me/api/customdate/delete';
  OFF_DATE_DATA;
  // add authorization header with jwt token
  headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
  options = new RequestOptions({ headers: this.headers });

  constructor(
                private modalService: NgbModal,
                public router: Router,
                public http: Http,
                public authHttp: AuthHttp,
                private cd: ChangeDetectorRef,
                public progressService: NgProgressService
  ) { }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }

  }

  formOffDate = new FormGroup({
      startDate: new FormControl('',Validators.required),
      endDate: new FormControl('',Validators.required),
      note: new FormControl('',Validators.required),
  });

  open(content) {
    this.progressService.start();
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
    this.OFF_DATE_DATA = [];
    this.http.get(this.DATE, this.options)
        .subscribe(params=>{
          if(params!=null){
            this.OFF_DATE_DATA = params.json();
            console.log(this.OFF_DATE_DATA);
          }
        });
    this.progressService.done();

  }

    deleteDay(date_id){
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(params=>{
          this.http.post(this.DATE_DELETE, {"custom_date_id":date_id}, this.options)
          .subscribe(params=>{
            swal(
              'Good Job!',
              'Successfully',
              'success'
            );

            this.OFF_DATE_DATA = [];
            this.http.get(this.DATE, this.options)
                .subscribe(params=>{
                  if(params!=null){
                    this.OFF_DATE_DATA = params.json();
                    console.log(this.OFF_DATE_DATA);
                  }
                });

          },(err)=>{
            swal(
              'Oops...',
              err.json().message,
              'error'
            );
          });
      });
    }

    pushDay(type){
        if(type == 1){
          let start_month1 = "";
          let end_month1 = "";
          let start_day1 = "";
          let end_day1 = "";

          let date_start = this.formOffDate.get('startDate').value;
          if(date_start.month<=9){
            start_month1 = "0"+date_start.month;
          } else{
            start_month1 = date_start.month;
          }

          if(date_start.day<=9){
            start_day1 = "0"+date_start.day;
          } else{
            start_day1 = date_start.day;
          }
          this.DateTemplate.custom_start_date = date_start.year+'-'+start_month1+'-'+start_day1;


          let date_end = this.formOffDate.get('endDate').value;
          if(date_end.month<=9){
            end_month1 = "0"+date_end.month;
          } else{
            end_month1 = date_end.month;
          }

          if(date_end.day<=9){
            end_day1 = "0"+date_end.day;
          } else{
            end_day1 = date_end.day;
          }
          this.DateTemplate.custom_end_date = date_end.year+'-'+end_month1+'-'+end_day1;
          this.DateTemplate.custom_status = false; //OFF DATE CODE
          this.DateTemplate.custom_note = this.formOffDate.get('note').value;

        } else if(type == 2){
          let start_month2 = "";
          let end_month2 = "";
          let start_day2 = "";
          let end_day2 = "";

          let date_start = this.formOffDate.get('startDate').value;
          if(date_start.month<=9){
            start_month2 = "0"+date_start.month;
          } else{
            start_month2 = date_start.month;
          }

          if(date_start.day<=9){
            start_day2 = "0"+date_start.day;
          } else{
            start_day2 = date_start.day;
          }
          this.DateTemplate.custom_start_date = date_start.year+'-'+start_month2+'-'+start_day2;


          let date_end = this.formOffDate.get('endDate').value;
          if(date_end.month<=9){
            end_month2 = "0"+date_end.month;
          } else{
            end_month2 = date_end.month;
          }

          if(date_end.day<=9){
            end_day2 = "0"+date_end.day;
          } else{
            end_day2 = date_end.day;
          }
          this.DateTemplate.custom_end_date = date_end.year+'-'+end_month2+'-'+end_day2;
          this.DateTemplate.custom_status = true; //ON DATE CODE
          this.DateTemplate.custom_note = this.formOffDate.get('note').value;
        }
        console.log(this.DateTemplate);
        // get users from api
        this.http.post(this.DATE_ADD, this.DateTemplate, this.options)
            .subscribe(params=>{
                swal(
                    'Good Job!',
                    'Successfully',
                    'success'
                );
                this.OFF_DATE_DATA = [];
                this.http.get(this.DATE, this.options)
                    .subscribe(params=>{
                      if(params!=null){
                        this.OFF_DATE_DATA = params.json();
                        console.log(this.OFF_DATE_DATA);
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
