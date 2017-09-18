import { Component, OnInit, NgZone, ViewChild  } from '@angular/core';
import { DataService } from '../shared/services/dataService';
import { Dashboard } from '../shared/models/caseModel';
import { SelectModule } from 'angular2-select';
import { CaseReportComponent } from './caseReport/caseReport.component';
import { FilterPipe } from '../shared/directives/searchPipe';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import {Popup} from 'ng2-opd-popup';
import {Case} from '../shared/models/caseModel';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2PaginationModule} from 'ng2-pagination';







@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    show: boolean;
    public data: Array<any> = [];
    public status: string;
    public caseId: string;
    public caseDetails: Case;
    public page : number = 1; //SK remove it, just for testing

    //  public rows:Array<any> = [];  

    constructor( private dataService: DataService, private zone: NgZone, private popup:Popup) {
        this.show = false;
        this.status = "loading";
        
    }
    

    ngOnInit() { 
        var instance : DashboardComponent = this;
        this.dataService.getAccess().then(() => {
        instance.paginationOpenCasesData(1);
        instance.paginationAvailableCasesData(1);
        instance.paginationDismissedData(1);
        instance.paginationSubmittedData(1);
        instance.status = "active"});
        
    }
    //openDialog = function(){
    // alert('hi Vandana');

    //}
    //@ViewChild('popup1') popup: Popup;
    openDialog(event: any) {
        // show the "please wait" popup
        this.caseId = event.srcElement.id;
        this.dataService.getCaseInformation(this.caseId)
        .then(resp => this.showDetails(resp)).//then(resp => console.log(this.caseDetails))/* turn the please wait popup into the real display */
        catch(error => console.error(error));

        //code to style the modal popup
        this.popup.options = {
        header: "Case Details",
        color: "#0275d8", // red, blue....
        widthProsentage: 70, // The with of the popou measured by browser width
        animationDuration: 0.5, // in seconds, 0 = no animation
        showButtons: true, // You can hide this in case you want to use custom buttons
        confirmBtnContent: "OK", // The text on your confirm button
        cancleBtnContent: "Cancel", // the text on your cancel button
        confirmBtnClass: "btn btn-default", // your class for styling the confirm button
        cancleBtnClass: "btn btn-default", // you class for styling the cancel button
        animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
};

  this.popup.show(this.popup.options);
        //this.popup.show()

    }

    showDetails( caseData : Case) :Case {
        this.caseDetails = caseData;
        return this.caseDetails;    
    }

    

    onToggle(show: boolean): void {

        this.show = !this.show;
    }

    dashBoardResponse(resp: Dashboard): void {
        for (let item in resp.cases) {
            //alert(item);
            console.log(item);
            let caseItem: any;
            caseItem = resp.cases[item];

            this.data.push({
                'id': caseItem.id,
                'OCME': caseItem.OCME,
                'ResidentCounty': caseItem.Data['ResidentCounty'],
                'DateofDeath': caseItem.Data['DateofDeath'],
                'CauseofDeath': caseItem.Data['CauseofDeath'],
                'CountyofDeath': caseItem.Data['CountyofDeath'],
                'Flagged': caseItem.Flagged,
                'Status': caseItem.Status
            });
        }

    }

    updateStatus(caseId: string, newStatus: string): void {
        this.status = "loading";
        this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
            if (newStatus == "Flagged") {
                this.data.find(item => item.id == caseId).Flagged = true;
            }
            else if (newStatus == "Unflagged") {
                this.data.find(item => item.id == caseId).Flagged = false;
            }
            else {
                this.data.find(item => item.id == caseId).Status = newStatus;
            }
            // location.reload(true);
            this.status = "active";
        });


    }

    fillDashboard(): void {
        this.dataService.getOpenCases(this.page).then(d => {
            this.dashBoardResponse(d);
        });
        this.dataService.getAvailableCases(this.page).then(d => {
            this.dashBoardResponse(d);
        });
         this.dataService.getDismissedCases(this.page).then(d => {
            this.dashBoardResponse(d);
        });
    }

    // paginationData(event): void {
    //     this.clearDashboard();
    //     this.dataService.getOpenCases(event).then(d => {
    //         this.dashBoardResponse(d);
    //     });
    //     this.dataService.getAvailableCases(event).then(d => {
    //         this.dashBoardResponse(d);
    //     });  
    //     this.dataService.getDismissedCases(event).then(d => {
    //         this.dashBoardResponse(d);
    //     });     

    // }

    paginationOpenCasesData(event): void {
        this.clearDashboard();
        this.dataService.getOpenCases(event).then(d => {
            this.dashBoardResponse(d);
        });    
    }
    
    paginationAvailableCasesData(event): void {
        this.clearDashboard();
        this.dataService.getAvailableCases(event).then(d => {
            this.dashBoardResponse(d);
        });    
    }
    
    paginationDismissedData(event): void {
        this.clearDashboard();
        this.dataService.getDismissedCases(event).then(d => {
            this.dashBoardResponse(d);
        });    
        }

    paginationSubmittedData(event): void {
            this.clearDashboard();
            this.dataService.getSubmittedCases(event).then(d => {
                this.dashBoardResponse(d);
            });    
            }
    



    clearDashboard(status?:any): void {
        this.data = [];
    }
}