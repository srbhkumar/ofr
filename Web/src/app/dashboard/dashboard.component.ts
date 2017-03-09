import { Component, OnInit, NgZone } from '@angular/core';
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
    public status : string;
  //  public rows:Array<any> = [];  

    constructor(private dataService: DataService,private zone:NgZone) {       
        this.show = false;
        this.status = "loading";
    }

    ngOnInit() {     
        this.fillDashboard();
        this.status = "active";
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
                'Flagged':  caseItem.Flagged,            
                'Status':caseItem.Status});
        }
      
    }

    updateStatus(caseId: string, newStatus: string): void {
       this.status = "loading";
       this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
           if(newStatus == "Flagged")
           {
            this.data.find(item => item.id == caseId).Flagged = true;
           }
           else if(newStatus == "Unflagged")
           {
            this.data.find(item => item.id == caseId).Flagged = false;
           }
         else{
              this.data.find(item => item.id == caseId).Status = newStatus;
         }
             // location.reload(true);
            this.status = "active";
         });
    
        
    }

    
     fillDashboard():void{
          this.dataService.getDashboard().then(d=>{
          this.dashBoardResponse(d);
         });
        
     }

     clearDashboard():void{
         this.data=[];
     }
}