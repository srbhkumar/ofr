import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MsalService } from './shared/services/MsalService';
 
@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html',
    providers: [MsalService]
})
 
export class AppComponent {

    constructor(private msalService: MsalService, public route: ActivatedRoute, public router: Router) {
        this.b2cAuthenticationEvent();
    }

    b2cAuthenticationEvent(): void {

        if (this.msalService.isOnline()) {
            this.router.navigate(['dashboard']);
        } else {
            this.msalService.login();
        }
    }

}