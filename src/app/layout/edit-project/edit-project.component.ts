import { DashboardService } from './../dashboard.service';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { Component, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/map'
declare var swal: any;
@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent {

  closeResult: string;

  constructor(private modalService: NgbModal) {}

  open(content) {
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

    formEditProject = new FormGroup({
        projectStatus: new FormControl('',Validators.required),
        projectTitle: new FormControl('',Validators.required),
        startDate: new FormControl('',Validators.required),
        endDate: new FormControl('',Validators.required)
    });

}
