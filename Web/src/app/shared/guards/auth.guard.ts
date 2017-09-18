import { Injectable } from '@angular/core';
import{Router,CanActivate} from '@angular/router';
import { MsalService } from '../services/MsalService';

@Injectable()
export class LoggedInGuard implements CanActivate{

    constructor(private msalService:MsalService){
    }

    canActivate():boolean{
        if(this.msalService.isOnline()===true)
        {
            return true;
        }
        return false;
    }
}
