import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '../services/MsalService'


@Component({
    selector: 'app-public',
    templateUrl: './default.component.html'
})

export class DefaultComponent {
    constructor( private msal: MsalService, public router: Router) { }
    logOut(){
        this.msal.logout();
        this.router.navigate(['']);
    }
}
