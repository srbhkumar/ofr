import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/AuthService';


@Component({
    selector: 'app-public',
    templateUrl: './default.component.html'
})

export class DefaultComponent implements OnInit {
    constructor(public authService: AuthService,public route: ActivatedRoute,public router: Router) { }
    ngOnInit() {
    }

    logOut(){
        this.authService.logOut();
          this.router.navigate(['login']);
    }
}
