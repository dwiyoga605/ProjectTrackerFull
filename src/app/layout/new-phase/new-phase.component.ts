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
  selector: 'app-new-phase',
  templateUrl: './new-phase.component.html',
  styleUrls: ['./new-phase.component.scss']
})
export class NewPhaseComponent {
  closeResult: string;
  @Input() functionID;
  @Output() phase : EventEmitter<any> = new EventEmitter();
  modalReference: NgbModalRef;

    // add authorization header with jwt token
    headers = new Headers({ 'Authorization': localStorage.getItem('userToken') });
    options = new RequestOptions({ headers: this.headers });

    GET_LIST_PG_SA = 'https://ayam.localtunnel.me/api/phase/pic';
    list_PG_SA: any;

    constructor(private modalService: NgbModal, private http:Http) {
      //get list PIC (SA AND PG LIST)
      this.http.get(this.GET_LIST_PG_SA, this.options)
      .subscribe(params=>{
          this.list_PG_SA = params.json();
          console.log("LIST PG SA : ");
          console.log(this.list_PG_SA);

          if(this.list_PG_SA != null){
              console.log("FLAG 1");
              let PG_SA = [];
              let PG_SA_ACTIVE = [];
              for(let i=0; i<this.list_PG_SA.length; i++){
                  PG_SA.push({"id":this.list_PG_SA[i].id_user, "text":this.list_PG_SA[i].name+' ('+this.list_PG_SA[i].employee_id+')'});
              }
              this.items2 = PG_SA;
          }
      });

      console.log("list PG SA : ");
      console.log(this.list_PG_SA);
    }

    ngOnInt(){
      console.log("**Function ID : "+this.functionID);
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

    newPhase = new FormGroup({
      phaseName: new FormControl('',Validators.required),
      startDate: new FormControl('',Validators.required),
      endDate: new FormControl('',Validators.required),
      phaseStatus: new FormControl('',Validators.required),
      phaseDate: new FormControl('',Validators.required),
      note: new FormControl('',Validators.required),

  });

  sendData = {
    "function_id":null,
    "phasename_name":"",
    "phase_start_date":"",
    "phase_end_date":"",
    "phase_status_date":"",
    "phase_status":"",
    "phase_PIC_id":null,
    "phase_note":""
  }

  pushNewPhase(){
    this.sendData.phase_note = this.newPhase.get('note').value;
    this.sendData.function_id = this.functionID;
    this.sendData.phasename_name = this.newPhase.get('phaseName').value;
    let startDate = this.newPhase.get('startDate').value;
    let endDate = this.newPhase.get('endDate').value;
    let phaseDate = this.newPhase.get('phaseDate').value;

    this.sendData.phase_start_date = startDate.year+"-"+startDate.month+"-"+startDate.day;
    this.sendData.phase_end_date = endDate.year+"-"+endDate.month+"-"+endDate.day;

    if(phaseDate != ""){
      this.sendData.phase_status_date = phaseDate.year+"-"+phaseDate.month+"-"+phaseDate.day
    } else{
      this.sendData.phase_status_date = "";
    }

/*     {
      "function_id" : 57,
      "phase_start_date" :"2017-08-19",
      "phase_end_date" :"2017-08-22",
      "phase_status":"2",
      "phase_status_date":"2017-08-19",
      "phase_note": "cc",
      "phase_PIC_id": 2,
      "phasename_name": "abc"
    } */

    let phaseStatusDate = this.newPhase.get('phaseStatus').value;

    if(phaseStatusDate == "Unknown"){
      this.sendData.phase_status = "1";
    } else if(phaseStatusDate == "Finished"){
      this.sendData.phase_status = "2";
    } else if(phaseStatusDate == "Postponed"){
      this.sendData.phase_status = "3";
    }

    let newPhase = 'https://ayam.localtunnel.me/api/phase/update';
    console.log(this.sendData);
    this.http.post(newPhase, this.sendData, this.options)
      .subscribe(params=>{
          swal(
            'Good Job!',
            'Successfully',
            'success'
        );

        console.log("phaselist emitter updated");
        this.phase.emit();
        this.modalReference.dismiss();
      },
    (err)=>{
        swal(
          'Oops...',
          err.json().message,
          'error'
        );
    });
  }

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  public items2:Array<string> = [];

  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value):void {
    this.sendData.phase_PIC_id = value.id;
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

}
