import { AddProjectComponent } from './add-project.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthHttp, AUTH_PROVIDERS, provideAuth, AuthConfig } from 'angular2-jwt/angular2-jwt';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { FileUploadModule } from "ng2-file-upload";

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'token'
  }), http);
}

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
  declarations: [AddProjectComponent],
  providers: [BaseRequestOptions]
})
export class AddProjectModule { 


}
