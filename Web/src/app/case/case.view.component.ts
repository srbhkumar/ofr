import { Component,OnInit } from '@angular/core';
import {Router, ActivatedRoute , Params} from '@angular/router';
import {  Template,CaseViewModel,TemplateField , Case} from '../shared/models/caseModel';
import { DataService } from '../shared/services/dataService';
import {FormGroup, FormControl, Validators, FormBuilder  , ReactiveFormsModule } from '@angular/forms';
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
   
    caseForm: FormGroup;
    
    timeoutTag:any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: DataService,
        private formBuilder : FormBuilder
    ){
        this.caseForm = formBuilder.group({
          
           
            "NameofReviewer" : ["Reviewer 1", Validators.nullValidator]   ,
            "YearofDeath" : ["2016", Validators.nullValidator],
            "DateofDeath":["2017-04-05", Validators.nullValidator]   ,
           "CountyofDeath" : ["test", Validators.nullValidator],
            "ResidentCounty" : ["County 1", Validators.required],
           "CauseofDeath" :["cause 1", Validators.nullValidator],
           "Sex":["", Validators.nullValidator],
           "Transgender":["", Validators.nullValidator],
           "DateofBirth":["", Validators.nullValidator],
           "Race":["", Validators.nullValidator],
           "Hispanic":["", Validators.nullValidator],
        });

        
    }

    ngOnInit():void
    {
       
      this.caseId = this.route.snapshot.params['id'];
   
      this.service.getCaseInformation(this.caseId).then(
             resp =>  this.getTemplateInformation(resp));   
    }

    getTemplateInformation(respCase:Case) {
        this.case = respCase;     
        this.service.getTemplate(respCase.Template).then(
            t => this.dataModel = {
                Template: t,
                changeset: {},
                Data: this.case.Data,
                IsDisplay: false,
                OnChange: this.onChange.bind(this)
            }
        );
    }

    onChange():void
    {
        if (this.timeoutTag)
        {
            clearTimeout(this.timeoutTag);
        }
        
        this.timeoutTag = setTimeout(this.saveChanges.bind(this), 3 * 1000);
    }

    saveChanges():void
    {
        this.timeoutTag = null;
        var oldChanges = this.dataModel.changeset;
        this.dataModel.changeset = {};
        this.service.saveCase(this.caseId, oldChanges)
            .catch(r => {
                for(var k in oldChanges)
                {
                    // pushing any changes back into the changeset
                    // ignore anything that's already been re-added (from new input)
                    if (this.dataModel.changeset[k]) continue;
                    this.dataModel.changeset[k] = oldChanges[k];
                }
            });
    }
}