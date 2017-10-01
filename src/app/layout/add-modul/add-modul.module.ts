import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthHttp, AUTH_PROVIDERS, provideAuth, AuthConfig } from 'angular2-jwt/angular2-jwt';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { AddModulComponent } from './add-modul.component';
import {SelectModule} from 'ng2-select-compat';

@NgModule({
  imports: [
    CommonModule,
    NgModule,
    NgbModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    SelectModule
  ],
  declarations: [
    AddModulComponent],
  providers: [BaseRequestOptions]
})
export class AddModulModule { 


}
