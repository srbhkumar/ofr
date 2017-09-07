import { Injectable } from '@angular/core';
import{Router,CanActivate} from '@angular/router';
import { AuthService } from '../services/authService';

@Injectable()
export class LoggedInGuard implements CanActivate{

    constructor(private authService:AuthService, private router:Router){
    }

    canActivate():boolean{
        if(this.authService.isLoggedIn()===true)
        {
            return true;
        }
        return false;
    }
}
