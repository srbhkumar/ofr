import { Component,OnInit } from '@angular/core';
import {Router, ActivatedRoute , Params} from '@angular/router';
import {  Template,CaseViewModel,TemplateField , Case} from '../shared/models/ofr';
import { DataService } from '../shared/services/dataService';
import 'rxjs/add/operator/switchMap';
@Component({
    selector:'case',
    templateUrl: './case.view.html'
})

export class CaseComponent implements OnInit {
    template:Template;
    dataModel:CaseViewModel;
    caseId:string;
    case:Case;
    MockData:any;
    isDataAvailable :boolean;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: DataService,
    ){}

    ngOnInit():void
    {
       
      this.caseId = this.route.snapshot.params['id'];
   
      this.service.getCaseInformation(this.caseId).then(
             resp =>  this.getTemplateInformation(resp)  );
      
    }
  
  getTemplateInformation(respCase:Case) {
      
        this.case = respCase;
       
        this.service.getTemplate(respCase.Template).then(
            t=> this.dataModel={Template:t,changeset:{},Data:{},IsDisplay:false} ); 
  }

    Save(value : string):void {
    }
}