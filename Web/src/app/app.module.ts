import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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
import{CaseFieldComponent} from './case/casefield.component';
 

@NgModule({
  declarations: [
   AppComponent,LoginComponent,ProtectedComponent,DashboardComponent,LayoutComponent,DefaultComponent,CaseComponent,CaseFieldComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,    
    routing,
    NgbModule.forRoot()
  ],
  providers: [LoggedInGuard,AuthService,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }