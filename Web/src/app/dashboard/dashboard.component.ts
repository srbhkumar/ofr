import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/dataService';
import { Dashboard } from '../shared/models/caseModel';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent {      
    dashboard:Dashboard;

    constructor(private dataService: DataService) {       
        this.dashboard=new Dashboard();
    }

    ngOnInit() {
        this.dataService.getDashboard().then(d=>this.dashboard=d); 
    }    
}