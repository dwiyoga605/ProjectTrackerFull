import { ChecklistComponent } from './checklist.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthHttp, AUTH_PROVIDERS, provideAuth, AuthConfig } from 'angular2-jwt/angular2-jwt';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { AddChecklistComponent } from '../add-checklist/add-checklist.component';
import { FileUploadModule } from "ng2-file-upload";

@NgModule({
  imports: [
    CommonModule,
    NgModule,
    NgbModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    FileUploadModule
  ],
  declarations: [ChecklistComponent, AddChecklistComponent],
  providers: [BaseRequestOptions]
})

export class ChecklistModule { 


}
