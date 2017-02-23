import { Injectable } from '@angular/core';
import{Router,CanActivate} from '@angular/router';
import{AuthService} from '../services/AuthService'

@Injectable()
export class LoggedInGuard implements CanActivate{

    constructor(private authService:AuthService,private router:Router){
    }

    canActivate():boolean{
        if(this.authService.isLoggedIn()===true)
        {
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'] );
        return false;

    }
}
