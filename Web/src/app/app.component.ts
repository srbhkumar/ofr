import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MsalService } from './shared/services/MsalService';
import { AuthService } from './shared/services/authService';
 
@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html',
})
 
export class AppComponent {

    constructor(private msalService: MsalService, private authService: AuthService, public route: ActivatedRoute, public router: Router) {
        this.b2cAuthenticationEvent();
    }
    b2cAuthenticationEvent(): void {
        let errorType = "1";

        if (localStorage.getItem(errorType) != null) {
            localStorage.removeItem(errorType);
            this.msalService.login();
        }
            else {
                this.msalService.login();
            }
        }
    

}