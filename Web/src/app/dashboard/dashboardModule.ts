
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import 'rxjs/add/operator/switchMap';

import{DataService} from '../shared/services/dataService';
import{ DashboardComponent} from '../dashboard/dashboard.component';
import { routing }        from '../app.routing';

@NgModule ({
    
  declarations: [
  DashboardComponent
  ],
  imports: [
      routing,
      BrowserModule
  ],
  providers: [ DataService],
  
})
export class DashboardModule { }
