import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import{  RouterModule} from '@angular/router';

import {APP_BASE_HREF} from '@angular/common';
import { AppComponent }  from './app.component';
 
import{AuthService} from './shared/services/authService';
import{DataService} from './shared/services/dataService';
 
import {DashboardModule} from  './dashboard/dashboardModule';
import {CaseModule} from './case/CaseModule';
import {LogInModule}from './login/loginModule';
 
 
 

@NgModule({
  declarations: [ AppComponent],
  imports: [    BrowserModule, HttpModule,RouterModule,
                DashboardModule, CaseModule, LogInModule 
           ],
  providers: [AuthService,DataService],
  bootstrap: [AppComponent]
})

export class AppModule { }
