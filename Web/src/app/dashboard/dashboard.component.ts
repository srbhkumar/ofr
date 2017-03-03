import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/dataService';
import { Dashboard } from '../shared/models/caseModel';
import { SelectModule } from 'angular2-select';
import { CaseReportComponent } from './caseReport/caseReport.component'

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent {      
    dashboard:Dashboard;
    show:boolean;

    constructor(private dataService: DataService) {       
        this.dashboard=new Dashboard();
        this.show = false;
    }

    ngOnInit() {
        this.dataService.getDashboard().then(d=>this.dashboard=d); 
    }    

    onToggle(show:boolean):void{
    
     this.show = !this.show;

    }

   
}