import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'angular2-select';
import {FormGroup, FormControl, Validators, FormBuilder  , ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'case-report',
    templateUrl: './caseReport.html'
})

export class CaseReportComponent {  
  caseReportForm: FormGroup;

  public items:any;
 
  private value:any = ['Athens'];
  private _disabledV:string = '0';
  private disabled:boolean = false;
   date :Date;

  constructor( private formBuilder : FormBuilder){
      this.date=new Date();
              this.caseReportForm = this.formBuilder.group({
                            "startDate" : ["",  Validators.required]   ,
                            "endDate" : [new Date(),  Validators.required],
                            "format":["csv",  Validators.required]   ,
                            "type" : ["Report",  Validators.required],
                            "jurisdiction" : ["County 1", Validators.nullValidator] 
                           
              });
              debugger;

     this.items = [
            {value: 'a', label: 'Alpha'},
            {value: 'b', label: 'Beta'},
            {value: 'c', label: 'Gamma'},
        ];

     console.log(this.caseReportForm);
     }
 
  private get disabledV():string {
    return this._disabledV;
  }
 
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }
 
  public selected(value:any):void {
    console.log('Selected value is: ', value);
  }
 
  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }
 
  public refreshValue(value:any):void {
    this.value = value;
  }
 
  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.text;
      }).join(',');
  }

  onSave(caseReportForm  :any) : void{
    console.log(caseReportForm);
    debugger;
  }
}