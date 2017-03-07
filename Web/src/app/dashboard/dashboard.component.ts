import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/dataService';
import { Dashboard } from '../shared/models/caseModel';
import { SelectModule } from 'angular2-select';
import { CaseReportComponent } from './caseReport/caseReport.component';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent  implements OnInit{ 
    show:boolean;
    public data;
    public rows:Array<any> = [];  

    constructor(private dataService: DataService) {       
      
        this.show = false;
    }

    ngOnInit() {     
        this.dataService.getDashboard().then(d=>{this.DashBoardResponse(d);});
    }    

    onToggle(show:boolean):void{
    
     this.show = !this.show;
    }

    DashBoardResponse(resp: Dashboard):void
    {
        for(let item in resp.cases)
        {
            this.rows.push(
                {
                'id':resp.cases[item].id,
                'OCME':resp.cases[item].OCME,
                'ResidentCounty':resp.cases[item].Data['ResidentCounty'],
                'DateofDeath':resp.cases[item].Data['DateofDeath'],
                'CauseofDeath':resp.cases[item].Data['CauseofDeath'],
                'CountyofDeath':resp.cases[item].Data['CountyofDeath'],                
                'Status':resp.cases[item].Status},
                )
        }
        this.data=this.rows;
    }

}