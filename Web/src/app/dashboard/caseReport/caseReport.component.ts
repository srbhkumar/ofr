import { Component, OnInit, Input } from '@angular/core';
import { SelectModule } from 'angular2-select';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from "rxjs/Observable";
import { ResponseContentType, RequestOptions, Http } from "@angular/http";
import { DataService} from "../../shared/services/dataService"
let jsPDF = require('jspdf');
 
 

@Component({
    selector: 'case-report',
    templateUrl: './caseReport.html'
})

export class CaseReportComponent {  
  @Input() type;
  @Input() title;
  caseReportForm: FormGroup;
  
  public items:any;
 
 
  private value:any = ['Athens'];
  private _disabledV:string = '0';
  private disabled:boolean = false;
   date :Date;

  constructor(private dataService: DataService, private formBuilder : FormBuilder){
      this.date=new Date();
              this.caseReportForm = this.formBuilder.group({
                            "startDateDeath" : ["",  Validators.nullValidator] ,
                            "endDateDeath" : [new Date(),  Validators.required],
                            "startDateReview" : ["", Validators.nullValidator],
                            "endDateReview" : [new Date(),  Validators.required],
                            "format":["csv",  Validators.required],
                            "jurisdiction" : ["County 1", Validators.nullValidator] 
                           
              });

     this.items = [{Value: 'Alabama',label:'Alabama'},
                  {Value:	'Alaska',label:'Alaska'},
                  {Value:	'Arizona',label:'Arizona'},
                  {Value:	'Arkansas',label:'Arkansas'},
                  {Value:	'California',label:'California'},
                  {Value:	'Colorado',label:'Colorado'},
                  {Value:	'Connecticut	',label:'Connecticut	'},
                  {Value:	'Delaware',label:'Delaware'},
                  {Value:	'District of Columbia',label:'District of Columbia'},
                  {Value:	'Florida',label:'Florida'},
                  {Value:	'Georgia',label:'Georgia'},
                  {Value:	'Hawaii',label:'Hawaii'},
                  {Value:	'Idaho',label:'Idaho'},
                  {Value:	'Illinois',label:'Illinois'},
                  {Value:	'Indiana',label:'Indiana'},
                  {Value:	'Iowa',label:'Iowa'},
                  {Value:	'Kansas',label:'Kansas'},
                  {Value:	'Kentucky',label:'Kentucky'},
                  {Value:	'Louisiana',label:'Louisiana'},
                  {Value:	'Maine',label:'Maine'},
                  {Value:	'Maryland',label:'Maryland'},
                  {Value:	'Massachusetts',label:'Massachusetts'},
                  {Value:	'Michigan',label:'Michigan'},
                  {Value:	'Minnesota',label:'Minnesota'},
                  {Value:	'Mississippi',label:'Mississippi'},
                  {Value:	'Missouri',label:'Missouri'},
                  {Value:	'Montana',label:'Montana'},
                  {Value:	'Nebraska',label:'Nebraska'},
                  {Value:	'Nevada',label:'Nevada'},
                  {Value:	'New Hampshire',label:'New Hampshire'},
                  {Value:	'New Jersey',label:'New Jersey'},
                  {Value:	'New Mexico',label:'New Mexico'},
                  {Value:	'New York',label:'New York'},
                  {Value:	'North Carolina',label:'North Carolina'},
                  {Value:	'North Dakota',label:'North Dakota'},
                  {Value:	'Ohio',label:'Ohio'},
                  {Value:	'Oklahoma',label:'Oklahoma'},
                  {Value:	'Oregon',label:'Oregon'},
                  {Value:	'Pennsylvania',label:'Pennsylvania'},
                  {Value:	'Rhode Island',label:'Rhode Island'},
                  {Value:	'South Carolina',label:'South Carolina'},
                  {Value:	'South Dakota',label:'South Dakota'},
                  {Value:	'Tennessee',label:'Tennessee'},
                  {Value:	'Texas',label:'Texas'},
                  {Value:	'Utah',label:'Utah'},
                  {Value:	'Vermont',label:'Vermont'},
                  {Value:	'Virginia',label:'Virginia'},
                  {Value:	'Washington',label:'Washington'},
                  {Value:	'West Virginia',label:'West Virginia'},
                  {Value:	'Wisconsin',label:'Wisconsin'},
                  {Value:	'Wyoming	',label:'Wyoming	'}];
        

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
  
    this.downloadCSV(caseReportForm.startDateDeath, caseReportForm.endDateDeath,caseReportForm.startDateReview, caseReportForm.endDateReview, this.type);
 
 
}

downloadCSV(startDateDeath: string, endDateDeath: string, startDateReview: string, endDateReview: string, type: string){
     
  this.dataService.DownloadCases(startDateDeath, endDateDeath, startDateReview, endDateReview, type).then(function(contents){
    var blob = new Blob([contents]);
    var filename = "ofr" + Date.now() + ".csv";
    if(navigator.msSaveBlob){
      navigator.msSaveBlob(blob, filename);
    } else {
      var csvUrl = window.URL.createObjectURL(blob);

      var arc = document.createElement('a');
      arc.id = "lnkDwnldLnk";
      arc.setAttribute('download', filename);
      arc.setAttribute('href', csvUrl);
      arc.click();
      document.body.appendChild(arc);
    }
  });

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
 
 