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
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';






@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    show: boolean;
    public data: Array<any> = [];
    public OpenCasesdata: Array<any> = [];
    public AvailableCasesdata: Array<any> = [];
    public DismissedCasesdata: Array<any> = [];
    public SubmittedCasesdata: Array<any> = [];
    public OpenObserve: Observable<Array<any>>;
    public AvailableObserve: Observable<Array<any>>;
    public SubmittedObserve: Observable<Array<any>>;
    public DismissedObserve: Observable<Array<any>>;
    public currentOpenCasePage: number;
    public currentAvailableCasePage: number;
    public currentDismissedCasePage: number;
    public currentSubmittedCasePage: number;
    public currentOpenCaseCount: number;
    public currentAvailableCaseCount: number;
    public currentDismissedCaseCount: number = 20;
    public currentSubmittedCaseCount: number;


    public status: string;
    public caseId: string;
    public caseDetails: Case;
    public page: number = 1; //SK remove it, just for testing
    public totalPage: number = 15; //SK remove it, just for testing

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

    constructor(private dataService: DataService, private zone: NgZone, private notificationsService: NotificationsService) {
        this.show = false;
        this.status = "loading";


    }


    ngOnInit() {
        var instance: DashboardComponent = this;
        this.dataService.getAccess()
            .then(() => instance.dataService.getGroups()
                .then(() => {
                    instance.paginationOpenCasesData(1);
                    instance.paginationAvailableCasesData(1);
                    instance.paginationDismissedData(1);
                    instance.paginationSubmittedData(1);
                    instance.status = "active"
                }));

    }

    //}
    //@ViewChild('popup1') popup: Popup;
    openDialog(event: any) {
        // show the "please wait" popup
        console.log(event);
        this.caseId = event.srcElement.id;
        this.dataService.getCaseInformation(this.caseId)
            .then(resp => this.showDetails(resp)).//then(resp => console.log(this.caseDetails))/* turn the please wait popup into the real display */
            catch(error => console.error(error));

    }

    showDetails(caseData: Case): Case {
        this.caseDetails = caseData;
        return this.caseDetails;
    }



    onToggle(show: boolean): void {

        this.show = !this.show;
    }

    dashBoardResponse(resp: Dashboard): void {
        for (let item in resp.cases) {
            let caseItem: any;
            caseItem = resp.cases[item];
            console.log(caseItem.DrugsInSystem);

            this.data.push({
                'id': caseItem.id,
                'OCME': caseItem.OCME,
                'ResidentJurisdiction': caseItem.Data['ResidentJurisdiction'],
                'DateofDeath': caseItem.Data['DateofDeath'],
                'CauseofDeath': caseItem.Data['CauseofDeath'],
                'CountyofDeath': caseItem.Data['CountyofDeath'],
                'Flagged': caseItem.Flagged,
                'Status': caseItem.Status,
                'DrugsInSystem': caseItem.DrugsInSystem
            });
        }

    }


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


    dashBoardOpenCasesResponse(resp: Dashboard): void {
        for (let item in resp.cases) {
            console.log(item);
            let caseItem: any;
            caseItem = resp.cases[item];
            if (caseItem.DrugsInSystem) {
                var DrugInSystemArray = (caseItem.DrugsInSystem);
                // console.log(caseItem.DrugsInSystem);
            }
            this.OpenCasesdata.push({
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
            this.currentOpenCaseCount = resp.total;
            this.OpenObserve = Observable.of(this.OpenCasesdata);
        }

    }


    dashBoardAvailableCasesResponse(resp: Dashboard): void {
        for (let item in resp.cases) {
            console.log(item);
            let caseItem: any;
            caseItem = resp.cases[item];
            this.AvailableCasesdata.push({
                'id': caseItem.id,
                'OCME': caseItem.OCME,
                'ResidentJurisdiction': caseItem.Data['ResidentJurisdiction'],
                'DateofDeath': caseItem.Data['DateofDeath'],
                'CauseofDeath': caseItem.Data['CauseofDeath'],
                'CountyofDeath': caseItem.Data['CountyofDeath'],
                'Flagged': caseItem.Flagged,
                'Status': caseItem.Status
            });
            this.currentAvailableCaseCount = resp.total;
            this.AvailableObserve = Observable.of(this.AvailableCasesdata);
        }

    }

    dashBoardDismissedCasesResponse(resp: Dashboard): void {
        for (let item in resp.cases) {
            console.log(item);
            let caseItem: any;
            caseItem = resp.cases[item];
            this.DismissedCasesdata.push({
                'id': caseItem.id,
                'OCME': caseItem.OCME,
                'ResidentJurisdiction': caseItem.Data['ResidentJurisdiction'],
                'DateofDeath': caseItem.Data['DateofDeath'],
                'CauseofDeath': caseItem.Data['CauseofDeath'],
                'CountyofDeath': caseItem.Data['CountyofDeath'],
                'Flagged': caseItem.Flagged,
                'Status': caseItem.Status
            });
        }
        this.currentDismissedCaseCount = resp.total;
        this.DismissedObserve = Observable.of(this.DismissedCasesdata);

    }


    dashBoardSubmittedCasesResponse(resp: Dashboard): void {
        for (let item in resp.cases) {
            console.log(item);
            let caseItem: any;
            caseItem = resp.cases[item];
            this.SubmittedCasesdata.push({
                'id': caseItem.id,
                'OCME': caseItem.OCME,
                'ResidentJurisdiction': caseItem.Data['ResidentJurisdiction'],
                'DateofDeath': caseItem.Data['DateofDeath'],
                'CauseofDeath': caseItem.Data['CauseofDeath'],
                'CountyofDeath': caseItem.Data['CountyofDeath'],
                'Flagged': caseItem.Flagged,
                'Status': caseItem.Status
            });
            this.currentSubmittedCaseCount = resp.total;
            this.SubmittedObserve = Observable.of(this.SubmittedCasesdata);
        }

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


    updateOpenCasesStatus(caseId: string, newStatus: string): void {
        this.status = "loading";
        this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
            if (newStatus == "Flagged") {
                this.OpenCasesdata.find(item => item.id == caseId).Flagged = true;
            }
            else if (newStatus == "Unflagged") {
                this.OpenCasesdata.find(item => item.id == caseId).Flagged = false;
            }
            else {
                //alert("Successfully Moved to Dismissed Cases");
                this.paginationOpenCasesData(this.currentOpenCasePage);
                this.paginationDismissedData(this.currentDismissedCasePage);
                this.StatusChangeNotification();
            }
            // location.reload(true);
            this.status = "active";
        });


    }


    updateAvailableCasesStatus(caseId: string, newStatus: string): void {
        this.status = "loading";
        this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
            if (newStatus == "Flagged") {
                this.AvailableCasesdata.find(item => item.id == caseId).Flagged = true;
            }
            else if (newStatus == "Unflagged") {
                this.AvailableCasesdata.find(item => item.id == caseId).Flagged = false;

            }
            else {
                if (newStatus == "Assigned") {
                    this.paginationAvailableCasesData(this.currentAvailableCasePage);
                    this.paginationOpenCasesData(this.currentOpenCasePage);
                }
                else {
                    this.paginationAvailableCasesData(this.currentAvailableCasePage);
                    this.paginationDismissedData(this.currentDismissedCasePage);
                }
                this.StatusChangeNotification();
            }
            // location.reload(true);
            this.status = "active";
        });


    }


    updateDismissedCasesStatus(caseId: string, newStatus: string): void {
        this.status = "loading";
        this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
            if (newStatus == "Flagged") {
                this.DismissedCasesdata.find(item => item.id == caseId).Flagged = true;
            }
            else if (newStatus == "Unflagged") {
                this.DismissedCasesdata.find(item => item.id == caseId).Flagged = false;
            }
            else {
                this.paginationDismissedData(this.currentDismissedCasePage);
                this.paginationOpenCasesData(this.currentOpenCasePage);
                this.StatusChangeNotification();
            }
            // location.reload(true);
            this.status = "active";
        });


    }


    updateSubmittedCasesStatus(caseId: string, newStatus: string): void {
        this.status = "loading";
        this.dataService.updateCaseStatus(caseId, newStatus).then(res => {
            if (newStatus == "Flagged") {
                this.SubmittedCasesdata.find(item => item.id == caseId).Flagged = true;

            }
            else if (newStatus == "Unflagged") {
                this.SubmittedCasesdata.find(item => item.id == caseId).Flagged = false;


            }
            else {
                this.paginationSubmittedData(this.currentSubmittedCasePage);
                this.paginationOpenCasesData(this.currentOpenCasePage);

                this.StatusChangeNotification();
                //code to reload the new status table
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

    // paginationOpenCasesData(event): void {
    //     this.clearDashboard();
    //     console.log("open cases" + event);
    //     this.dataService.getOpenCases(event).then(d => {
    //         this.dashBoardResponse(d);
    //     });    
    // }


    paginationOpenCasesData(event): void {
        this.clearOpenCasesDashboard();
        this.currentOpenCasePage = event;
        console.log(this.currentOpenCasePage);
        this.dataService.getOpenCases(event).then(d => {
            this.dashBoardOpenCasesResponse(d);
        });
    }

    paginationAvailableCasesData(event): void {
        this.clearAvailableCasesDashboard();
        this.currentAvailableCasePage = event;
        console.log(this.currentAvailableCasePage);
        this.dataService.getAvailableCases(event).then(d => {
            this.dashBoardAvailableCasesResponse(d);
        });
    }

    paginationDismissedData(event): void {
        this.clearDismissedCasesDashboard();
        this.currentDismissedCasePage = event;
        console.log(this.currentDismissedCasePage);
        this.dataService.getDismissedCases(event).then(d => {
            this.dashBoardDismissedCasesResponse(d);
        });
    }

    paginationSubmittedData(event): void {
        this.clearSubmittedCasesDashboard();
        this.currentSubmittedCasePage = event;
        console.log(this.currentSubmittedCasePage);
        this.dataService.getSubmittedCases(event).then(d => {
            this.dashBoardSubmittedCasesResponse(d);
        });
    }




    clearDashboard(status?: any): void {
        this.data = [];
    }

    clearOpenCasesDashboard(status?: any): void {
        this.OpenCasesdata = [];
    }

    clearDismissedCasesDashboard(status?: any): void {
        this.DismissedCasesdata = [];
    }

    clearAvailableCasesDashboard(status?: any): void {
        this.AvailableCasesdata = [];
    }

    clearSubmittedCasesDashboard(status?: any): void {
        this.SubmittedCasesdata = [];
    }
}
