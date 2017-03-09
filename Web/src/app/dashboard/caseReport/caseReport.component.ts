import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'angular2-select';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { ResponseContentType, RequestOptions, Http } from "@angular/http";
let jsPDF = require('jspdf');
 
 

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

  onSave(caseReportForm  :any) {
    console.log(caseReportForm);
  
    if(caseReportForm.format.toLowerCase() == "csv")
    {
        this.downloadCSV();
    }
     if(caseReportForm.format.toLowerCase() == "pdf")
    {
       this.downloadPDF();
    }
 
 
}

downloadCSV(){
     var blob = new Blob([this.items], { type: 'text/csv' });
     var csvUrl = window.URL.createObjectURL(blob);

    var arc = document.createElement('a');
    arc.id = "lnkDwnldLnk";
    arc.setAttribute('download', "test.csv");
    arc.setAttribute('href', csvUrl);
    arc.click();
    document.body.appendChild(arc);

}
//<table style=width:100%><tr><th>Firstname</th><th>Lastname</th> <th>Age</th></tr><tr><td>Jill</td><td>Smith</td> <td>50</td></tr><tr><td>Eve</td><td>Jackson</td> <td>94</td> </tr></table>
downloadPDF(){
        
var doc = new jsPDF();
    var i=0;
      for(var key in this.items){
           doc.text(20, 10 + i, "test: " + key);
              i+=10;
      } 
        doc.save('Test.pdf');
    }

 
}
 
 