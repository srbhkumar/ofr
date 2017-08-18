import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {Ng2PaginationModule} from 'ng2-pagination';
import { AppComponent }  from './app.component';
import{LoginComponent} from './login/login.component';
import{ProtectedComponent} from './protected/protected.component';
import{DashboardComponent} from '../app/dashboard/dashboard.component';


import { routing }        from './app.routing';
import{LoggedInGuard} from './shared/guards/auth.guard';
import{AuthService} from './shared/services/authService';
import{DataService} from './shared/services/dataService';
 
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
import { PopupModule } from 'ng2-opd-popup';


@NgModule({
  declarations: [
   AppComponent,LoginComponent,ProtectedComponent,DashboardComponent,LayoutComponent,DefaultComponent,CaseComponent,
   CaseFieldComponent,CaseReportComponent,FilterPipe,CaseDetailsComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,    
    routing,
    NgbModule.forRoot(),
    SelectModule,
    PopupModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    DataTableModule,
    Ng2PaginationModule
  ],
  providers: [LoggedInGuard,AuthService,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
