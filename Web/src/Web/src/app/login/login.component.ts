import{Component,OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/authService';

@Component(
    {        
        selector:'login',
        templateUrl:'./login.component.html',
        styleUrls: ['./signin.css']
    }
)

export class LoginComponent implements OnInit{
    message: string;
    returnUrl: string;
    profile = {};
   

    constructor(public authService: AuthService,public route: ActivatedRoute,public router: Router) {
        this.message = '';        
    }

    ngOnInit() {        
        this.authService.logOut();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';                
    }

    login(userName: string, password: string): boolean {
        this.message = '';
        //This will never work as expected and needs to be corrected
        if (this.authService.login(userName, password)) {              
            this.router.navigate(['dashboard']);
        }
        this.message = 'Incorrect credentials';
        return false;
    }
    logOut():void{
        this.authService.logOut();
    }
}