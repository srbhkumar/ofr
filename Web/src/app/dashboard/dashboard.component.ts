import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { DataService } from '../shared/services/dataService';
import { Dashboard } from '../shared/models/caseModel';
import { SelectModule } from 'angular2-select';
import { CaseReportComponent } from './caseReport/caseReport.component';
import { FilterPipe } from '../shared/directives/searchPipe';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Case } from '../shared/models/caseModel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2PaginationModule } from 'ng2-pagination';
import { NotificationsService } from 'angular2-notifications';
import {AppConfig} from '../app.config'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';






@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    showReport: boolean;
    showCensus: boolean;
    public OpenObserve: Observable<Array<any>>;
    public AvailableObserve: Observable<Array<any>>;
    public SubmittedObserve: Observable<Array<any>>;
    public DismissedObserve: Observable<Array<any>>;
    public currentOpenCasePage: number = 1;
    public currentAvailableCasePage: number = 1;
    public currentDismissedCasePage: number = 1;
    public currentSubmittedCasePage: number = 1 ;
    public currentOpenCaseCount: number = 0;
    public currentAvailableCaseCount: number = 0;
    public currentDismissedCaseCount: number = 0;
    public currentSubmittedCaseCount: number = 0 ;
    public pageSizeOpen: number = 5;
    public pageSizeAvailable: number = 20;
    public pageSizeSubmitted: number = 5;
    public pageSizeDismissed: number = 5;
    public flagFilter: boolean = false;



    public status: string;
    public caseId: string;
    public caseDetails: Case;


    //  public rows:Array<any> = [];  

    public options = {
        id: 2,
        timeOut: 4 * 1000,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: false,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'bottom']
    };

    constructor(private dataService: DataService, private config: AppConfig, private zone: NgZone, private notificationsService: NotificationsService) {
        this.showReport = false;
        this.showCensus = false;
        this.status = "loading";


    }


    ngOnInit() {
        var instance: DashboardComponent = this;
        this.dataService.getAccess()
            .then(() => instance.dataService.getGroups()
                .then(() => {
                    instance.pageSizeOpen = Number(instance.config.getConfig("pageSizeAssigned"));
                    instance.pageSizeAvailable = Number(instance.config.getConfig("pageSizeAvailable"));
                    instance.pageSizeSubmitted = Number(instance.config.getConfig("pageSizeSubmitted"));
                    instance.pageSizeDismissed = Number(instance.config.getConfig("pageSizeDismissed"));
                    instance.paginationOpenCasesData(this.currentOpenCasePage);
                    instance.paginationAvailableCasesData(this.currentAvailableCasePage);
                    instance.paginationDismissedData(this.currentDismissedCasePage);
                    instance.paginationSubmittedData(this.currentSubmittedCasePage);
                    instance.status = "active";
                }));

    }

    //}
    //@ViewChild('popup1') popup: Popup;
    openDialog(event: any) {
        // show the "please wait" popup
        this.caseId = event.srcElement.id;
        this.dataService.getCaseInformation(this.caseId)
            .then(resp => this.showDetails(resp)).//then(resp => console.log(this.caseDetails))/* turn the please wait popup into the real display */
            catch(error => console.error(error));

    }

    showDetails(caseData: Case): Case {
        this.caseDetails = caseData;
        return this.caseDetails;
    }


    fileChange(event){
        var confirmationString = "Confirm that you intend to upload files:\n";
        for (let file of event.target.files) {
            confirmationString = confirmationString + file.name + "\n";
        }

        if (confirm(confirmationString) == true) {
            this.dataService.uploadFiles(event.target.files);
        }
    }

    onToggleReport(show: boolean): void {
        this.showReport = !this.showReport;
        this.showCensus = this.showCensus ? !this.showCensus: this.showCensus;
    }

    onToggleCensus(show: boolean): void {
        this.showCensus = !this.showCensus;
        this.showReport = this.showReport ? !this.showReport : this.showReport;
    }

    // dashBoardResponse(resp: Dashboard): void {
    //     for (let item in resp.cases) {
    //         let caseItem: any;
    //         caseItem = resp.cases[item];
    //         console.log(caseItem.DrugsInSystem);

    //         this.data.push({
    //             'id': caseItem.id,
    //             'OCME': caseItem.OCME,
    //             'ResidentJurisdiction': caseItem.Data['ResidentJurisdiction'],
    //             'DateofDeath': caseItem.Data['DateofDeath'],
    //             'CauseofDeath': caseItem.Data['CauseofDeath'],
    //             'CountyofDeath': caseItem.Data['CountyofDeath'],
    //             'Flagged': caseItem.Flagged,
    //             'Status': caseItem.Status,
    //             'DrugsInSystem': caseItem.DrugsInSystem
    //         });
    //     }

    // }


    StatusChangeNotification(): any {
        this.notificationsService.success(
            "Status Changed",
            "Status Successfully Changed",
            {
                //SK_These options override the options set for ping notification
                id: 2,
                position: ["top", "right"],
                timeOut: 3 * 1000,
                maxStack: 3,
                showProgressBar: false,
                pauseOnHover: true,
                clickToClose: true,
            }
        );
    }

    dashboardHelper(respCases: Array<any>): Observable<Array<any>>{
        var tempData = [];
        for (let item in respCases) {
            let caseItem: any;
            caseItem = respCases[item];
            if (caseItem.DrugsInSystem) {
                var DrugInSystemArray = (caseItem.DrugsInSystem);
                // console.log(caseItem.DrugsInSystem);
            }
            tempData.push({
                'id': caseItem.id,
                'OCME': caseItem.OCME,
                'ResidentJurisdiction': caseItem.Data['ResidentJurisdiction'],
                'DateofDeath': caseItem.Data['DateofDeath'],
                'CauseofDeath': caseItem.Data['CauseofDeath'],
                'CountyofDeath': caseItem.Data['CountyofDeath'],
                'Flagged': caseItem.Flagged,
                'Status': caseItem.Status,
                'DrugInSystem': caseItem.DrugInSystem

            });
        }
        return Observable.of(tempData);
    }


    dashBoardOpenCasesResponse(resp: Dashboard): void {
        this.currentOpenCaseCount = resp.total;
        this.OpenObserve = this.dashboardHelper(resp.cases);
    }


    dashBoardAvailableCasesResponse(resp: Dashboard): void {
        this.currentAvailableCaseCount = resp.total;
        this.AvailableObserve = this.dashboardHelper(resp.cases);
    }

    dashBoardDismissedCasesResponse(resp: Dashboard): void {
        this.currentDismissedCaseCount = resp.total;
        this.DismissedObserve = this.dashboardHelper(resp.cases);

    }


    dashBoardSubmittedCasesResponse(resp: Dashboard): void {
        this.currentSubmittedCaseCount = resp.total;
        this.SubmittedObserve = this.dashboardHelper(resp.cases);
    }

    // updateStatus(caseId: string, newStatus: string): void {
    //     this.status = "loading";
    //     this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
    //         if (newStatus == "Flagged") {
    //             this.data.find(item => item.id == caseId).Flagged = true;
    //         }
    //         else if (newStatus == "Unflagged") {
    //             this.data.find(item => item.id == caseId).Flagged = false;
    //         }
    //         else {
    //             this.data.find(item => item.id == caseId).Status = newStatus;
    //         }
    //         // location.reload(true);
    //         this.status = "active";
    //     });


    // }

    updateCaseStatus(caseId:string, oldStatus: string, newStatus: string):void{
        this.status = "loading";
        this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
            if(oldStatus == "Dismissed" || newStatus == "Dismissed")
                this.paginationDismissedData(this.currentDismissedCasePage);
            if(oldStatus == "Submitted" || newStatus == "Submitted")
                this.paginationSubmittedData(this.currentSubmittedCasePage);
            if(oldStatus == "Assigned" || newStatus == "Assigned")
                this.paginationOpenCasesData(this.currentOpenCasePage);
            if(oldStatus == "Available" || newStatus == "Available")
                this.paginationAvailableCasesData(this.currentAvailableCasePage);
            this.StatusChangeNotification();
            this.status = "active";
            });

    }


    // fillDashboard(): void {
    //     this.dataService.getOpenCases(this.page).then(d => {
    //         this.dashBoardResponse(d);
    //     });
    //     this.dataService.getAvailableCases(this.page).then(d => {
    //         this.dashBoardResponse(d);
    //     });
    //     this.dataService.getDismissedCases(this.page).then(d => {
    //         this.dashBoardResponse(d);
    //     });
    // }

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

    // paginationOpenCasesData(event): void {
    //     this.clearDashboard();
    //     console.log("open cases" + event);
    //     this.dataService.getOpenCases(event).then(d => {
    //         this.dashBoardResponse(d);
    //     });    
    // }


    paginationOpenCasesData(event): void {
        this.currentOpenCasePage = event;
        this.dataService.getOpenCases(event, this.pageSizeOpen, this.flagFilter).then(d => {
            this.dashBoardOpenCasesResponse(d);
        });
    }

    paginationAvailableCasesData(event): void {
        this.currentAvailableCasePage = event;
        this.dataService.getAvailableCases(event, this.pageSizeAvailable, this.flagFilter).then(d => {
            this.dashBoardAvailableCasesResponse(d);
        });
    }

    paginationDismissedData(event): void {
        this.currentDismissedCasePage = event;
        this.dataService.getDismissedCases(event, this.pageSizeDismissed, this.flagFilter).then(d => {
            this.dashBoardDismissedCasesResponse(d);
        });
    }

    paginationSubmittedData(event): void {
        this.currentSubmittedCasePage = event;
        this.dataService.getSubmittedCases(event, this.pageSizeSubmitted, this.flagFilter).then(d => {
            this.dashBoardSubmittedCasesResponse(d);
        });
    }
    format(key: any): any{
        var data = this.caseDetails.OCMEData[key];
        if (key.indexOf('COD') == 0){
            switch (data){
                case '#NULL!':
                    return "Test not performed";
                case '':
                    return "N/A";
                case "0":
                    return "No";
                case "1":
                    return "Yes";
                case "2":
                    return "Suspected";
                default:
                    return data;
            }    
        }
        else{
            switch (data){
                case '#NULL!':
                    return "N/A";
                case '':
                    return "N/A";
                case "0":
                    return "Not Present";
                case "1":
                    return "Present";
                default:
                    return data;
            }
        }
    }
}
