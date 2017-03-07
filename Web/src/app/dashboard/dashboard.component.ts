import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/dataService';
import { Dashboard } from '../shared/models/caseModel';
import { SelectModule } from 'angular2-select';
import { CaseReportComponent } from './caseReport/caseReport.component';
import {FilterPipe} from '../shared/directives/searchPipe';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent  implements OnInit{ 
    show:boolean;
    public data :Array<any> = [];  
  //  public rows:Array<any> = [];  

    constructor(private dataService: DataService) {       
        this.show = false;
    }

    ngOnInit() {     
        this.fillDashboard();
    }    

    onToggle(show:boolean):void{
    
     this.show = !this.show;
    }

    dashBoardResponse(resp: Dashboard):void
    {
        for(let item in resp.cases)
        {
            let caseItem:any;
            caseItem=resp.cases[item];
            this.data.push({
                'id':caseItem.id,
                'OCME':caseItem.OCME,
                'ResidentCounty':caseItem.Data['ResidentCounty'],
                'DateofDeath':caseItem.Data['DateofDeath'],
                'CauseofDeath':caseItem.Data['CauseofDeath'],
                'CountyofDeath':caseItem.Data['CountyofDeath'],                
                'Status':caseItem.Status});
        }
      
    }

    updateStatus(caseId: string, newStatus: string): void {

        this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
            this.clearDashboard();
            this.fillDashboard();

            // TODO: To update the case record instead of pulling the whole dashboard data
            // this.data.find(item => item.id == caseId).Status = newStatus;

        });
    }

     fillDashboard():void{
          this.dataService.getDashboard().then(d=>{this.dashBoardResponse(d);});
        
     }

     clearDashboard():void{
         this.data=[];
     }
}