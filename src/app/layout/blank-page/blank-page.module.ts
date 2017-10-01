import { NewUserComponent } from './../new-user/new-user.component';
import { ImportDataComponent } from './../import-data/import-data.component';
import { NewPhaseComponent } from './../new-phase/new-phase.component';
import { OffDateComponent } from './../off-date/off-date.component';

import { ChecklistComponent } from './../checklist/checklist.component';
import { EditProjectComponent } from './../edit-project/edit-project.component';
import { AddModulComponent } from './../add-modul/add-modul.component';
import { AddProjectComponent } from './../add-project/add-project.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthHttp, AUTH_PROVIDERS, provideAuth, AuthConfig } from 'angular2-jwt/angular2-jwt';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { BlankPageRoutingModule } from './blank-page-routing.module';
import { BlankPageComponent } from './blank-page.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DashboardService } from '../dashboard.service';
import { AddChecklistComponent } from '../add-checklist/add-checklist.component';
import {SelectModule} from 'ng2-select-compat';
import { PhaseDetailComponent } from '../../phase-detail/phase-detail.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ObjectPipe } from './object-pipe.pipe';
import { FileUploadModule } from "ng2-file-upload";

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'JWT',
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => localStorage.getItem('userToken')),
  }), http);
}

@NgModule({
  imports: [
    CommonModule,
    BlankPageRoutingModule,
    NgbModule.forRoot(),
    NgbDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SmartTableModule,
    SelectModule,
    ChartsModule,
    FileUploadModule
  ],
  declarations: [
    BlankPageComponent,
    AddProjectComponent,
    AddModulComponent,
    EditProjectComponent,
    ChecklistComponent,
    AddChecklistComponent,
    PhaseDetailComponent,
    OffDateComponent,
    ObjectPipe,
    NewPhaseComponent,
    ImportDataComponent,
    NewUserComponent
    
    ],
    providers: [
        DashboardService,
        AuthHttp,
        {
          provide: AuthHttp,
          useFactory: getAuthHttp,
          deps: [Http]
        },
        BaseRequestOptions
    ]
})
export class BlankPageModule { 


}
