import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'app/shared/services/dataService';

@Component({
  selector: 'app-pdmp',
  templateUrl: './pdmp.component.html',
  styleUrls: ['./pdmp.component.css']
})
export class PdmpComponent implements OnInit {
  @Input() ocme: string;
  private pdmpData: Array<any>;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getPDMPData(this.ocme).then(val => {
      this.pdmpData = val;
    });
  }

}
