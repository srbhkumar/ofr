import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/authService';


@Component({
    selector: 'app-public',
    templateUrl: './default.component.html'
})

export class DefaultComponent {
    constructor(public authService: AuthService, public router: Router) { }
    logOut(){
        this.authService.logOut();
        this.router.navigate(['login']);
    }
}
