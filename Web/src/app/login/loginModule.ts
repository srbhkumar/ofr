 
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import 'rxjs/add/operator/switchMap';

import{LoginComponent} from '../login/login.component';
import{ProtectedComponent} from '../protected/protected.component';
  
import { routing }        from '../app.routing';
import{LoggedInGuard} from '../shared/guards/auth.guard';
import{AuthService} from '../shared/services/authService';
import{DefaultComponent} from '../shared/layouts/default.component';
import{LayoutComponent} from '../shared/layouts/layout.component';



@NgModule ({
    
  declarations: [
   LoginComponent,ProtectedComponent,LayoutComponent,DefaultComponent
  ],
  imports: [
      routing,
      BrowserModule
  ],
  providers: [LoggedInGuard, AuthService],
  
})
export class LogInModule { }
