import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { DataService } from 'app/shared/services/dataService';

@Component({
  selector: 'app-pdmp',
  templateUrl: './pdmp.component.html',
  styleUrls: ['./pdmp.component.css']
})
export class PdmpComponent implements OnInit, OnChanges {
  @Input() caseId: string;
  private pdmpData: any;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    debugger;
    this.dataService.getPDMPData(this.caseId).then(val => {
      this.pdmpData = val;
    });
  }

  ngOnChanges() {
    this.dataService.getPDMPData(this.caseId)
      .then(val => {debugger; this.pdmpData = val;})
      .catch(_ => {this.pdmpData = null;});
  }

}
