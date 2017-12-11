import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {Ng2PaginationModule} from 'ng2-pagination';
import { AppComponent }  from './app.component';
import{ProtectedComponent} from './protected/protected.component';
import{DashboardComponent} from '../app/dashboard/dashboard.component';


import { routing }        from './app.routing';
import{LoggedInGuard} from './shared/guards/auth.guard';
import {MsalService} from './shared/services/MsalService';
import{DataService} from './shared/services/dataService';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig }       from './app.config';
 
import{DefaultComponent} from './shared/layouts/default.component';
import{LayoutComponent} from './shared/layouts/layout.component';
import{CaseComponent} from './case/case.view.component';
import{CaseDetailsComponent} from './case/case-details.component'
import{CaseFieldComponent} from './case/casefield.component';
import {CaseReportComponent} from './dashboard/caseReport/caseReport.component';
import { SelectModule } from 'angular2-select'
import{SimpleNotificationsModule} from 'angular2-notifications';
import {DataTableModule} from "angular2-datatable";
import {FilterPipe} from './shared/directives/searchPipe';
//import {MdDialog, MdDialogRef} from '@angular/material';
import { DialogRef, ModalComponent, CloseGuard, ModalModule } from 'angular2-modal';
import {MainPipe} from './shared/pipes/main-pipe.module'
import { CaseTemplateComponent } from './dashboard/case-template/caseTemplate.component';
import { CaseTemplateFieldComponent } from './dashboard/case-template/caseTemplateField.component';
import { CaseTemplateGroupComponent } from './dashboard/case-template/caseTemplateGroup.component';

@NgModule({
  declarations: [
   AppComponent, ProtectedComponent,DashboardComponent,LayoutComponent,DefaultComponent,CaseComponent,
   CaseFieldComponent,CaseReportComponent,FilterPipe,CaseDetailsComponent,
   CaseTemplateComponent, CaseTemplateFieldComponent, CaseTemplateGroupComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,    
    routing,
    NgbModule.forRoot(),
    SelectModule,
    SimpleNotificationsModule.forRoot(),
    DataTableModule,
    Ng2PaginationModule,
    MainPipe
  ],
  providers: [LoggedInGuard, MsalService, DataService,
    AppConfig,{ provide: APP_INITIALIZER, useFactory: init_app, deps: [AppConfig], multi: true }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function init_app(first_service: AppConfig){
  // Do initing of services that is required before app loads
  // NOTE: this factory needs to return a function (that then returns a promise)
  return () => first_service.load()  // + any other services...
}
