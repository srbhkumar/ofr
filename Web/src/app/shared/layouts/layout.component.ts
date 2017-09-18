import { Component, OnInit } from '@angular/core';
import {MsalService} from '../services/MsalService'
@Component({
    selector: 'app-secure',
    templateUrl: './layout.component.html'    
})
export class LayoutComponent implements OnInit {
    constructor(private msalService: MsalService) { }
    ngOnInit() {
    }

    logout(){
        this.msalService.logout();
    }
}
