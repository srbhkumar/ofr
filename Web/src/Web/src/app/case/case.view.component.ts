import { Component, OnChanges, SimpleChanges, OnInit, Input } from '@angular/core';
import { HttpModule, Headers, Http } from '@angular/http';
import {Router, ActivatedRoute, Params } from '@angular/router';
import{CaseFieldComponent} from './casefield.component';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import {  Template,CaseViewModel,TemplateField } from './ofr';
import { DataService } from '../shared/services/dataService';

@Component({
    selector:'case',
    templateUrl: './case.view.html'
})

export class CaseComponent implements OnInit {
    
    template:Template;
    vm:CaseViewModel;
    greetMessage:string;
    MockData:any;
    isDataAvailable :boolean;
   
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: DataService,
    )
    {
        //this.template=new Template();
     
    }

    ngOnInit():void
    {
        /*this.dataService.getTemplate(c.Template)
                    .then(t => this.vm = { Template: t, Data: this.CaseInfo.Data, IsDisplay: false, changeset:{} })
                    .catch(console.log);*/

           this.dataService.getTemplate('2691e182-04d3-4499-9a89-14bb531bc770').then(
               t=>
               this.vm={Template:t,changeset:{},Data:{},IsDisplay:false}
           ); 

           /*this.dataService.httpget<Template>('/template/2691e182-04d3-4499-9a89-14bb531bc770').then(
               t=>
               this.SetData(t)
           ); */

          //this.CallAPI().then(()=>this.isDataAvailable=true);

        //this.MockData=this.dataService.getAllUser();

        //this.getCaseItems();
    }

 getCaseItems() {
        this.dataService.getCaseItems()
            .subscribe(
            resdata => this.getCaseItemsResponse(resdata)//,
            //error => this.errorMessage = <any>error
            );
    }

    private getCaseItemsResponse(resdata: any) {
       
        this.template=resdata;
        
    }

    forceSave():void
    {
        /*this.ofr.saveCase(this.CaseInfo.id, this.vm.changeset).then(res => {
            if (res.Result == "Success")
            {
                this.vm.changeset = {};
            }
        });*/
    }
}