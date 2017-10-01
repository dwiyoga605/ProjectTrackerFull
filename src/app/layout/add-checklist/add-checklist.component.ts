import { DashboardService } from './../dashboard.service';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/map'
declare var swal: any;

@Component({
  selector: 'app-add-checklist',
  templateUrl: './add-checklist.component.html',
  styleUrls: ['./add-checklist.component.scss']
})
export class AddChecklistComponent {

  closeResult: string;
  @Input() phaseID;
  @Output() updateChecklist:EventEmitter<any> = new EventEmitter();

  POST_NEW_CHECKLIST = 'https://ayam.localtunnel.me/api/checklist/add';
  GET_CHECKLIST_BYPHASEID = 'https://ayam.localtunnel.me/api/checklist/getbyid';
  checklistData = [];
  // add authorization header with jwt token
  headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
  options = new RequestOptions({ headers: this.headers });

  constructor(private modalService: NgbModal, private http: Http) {}

  open(content) {
    let sendData = {
      "phase_id": this.phaseID
    };
    //get checklist list based on phaseID that was clicked by user
    this.http.post(this.GET_CHECKLIST_BYPHASEID, sendData, this.options)
        .subscribe(params=>{
            this.checklistData = params.json();
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
      checklistName: new FormControl('',Validators.required)
  });

  addChecklist(){
    let sendData = {
      "checklist_phase_id": this.phaseID,
      "checklist_text": this.formChecklist.get('checklistName').value
    };

    this.http.post(this.POST_NEW_CHECKLIST,sendData, this.options)
        .subscribe(params=>{
            swal(
                'Good Job!',
                'Successfully',
                'success'
            );
            this.updateChecklist.emit();

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
