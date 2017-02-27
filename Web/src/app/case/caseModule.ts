import { NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {  ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import 'rxjs/add/operator/switchMap';


import{CaseComponent} from '../case/case.view.component';
import{CaseFieldComponent} from '../case/casefield.component';
import{DataService} from '../shared/services/dataService';
 

@NgModule ({
    
  declarations: [
   CaseComponent,CaseFieldComponent
  ],
  imports: [
      BrowserModule,
      ReactiveFormsModule,
      
      NgbModule.forRoot()
  ],
  providers: [ DataService],
  
})
export class CaseModule { }
