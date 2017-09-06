import { Component,OnInit } from '@angular/core';
import {Router, ActivatedRoute , Params} from '@angular/router';
import {Template,CaseViewModel,TemplateField , Case} from '../shared/models/caseModel';
import { DataService } from '../shared/services/dataService';
import {FormGroup, FormControl, Validators, FormBuilder  , ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import {DashboardComponent} from '../dashboard/dashboard.component';


@Component({
    selector:'case-details',
    templateUrl: './case-details.html'
})

export class CaseDetailsComponent implements OnInit {
caseId:string;
case:Case;
userName:string;

constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: DataService,
        private formBuilder : FormBuilder
){
    this.userName='Rock';//Temporery code. Once SSO is implemented we'll make it dynamic.
    //this.initializeFormControls();   
}


 ngOnInit():void
    {
       
      this.caseId = this.route.snapshot.params['id'];
   
     console.log(this.caseId);             
    }


}