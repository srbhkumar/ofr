import { Component,OnInit } from '@angular/core';
import {Router, ActivatedRoute , Params} from '@angular/router';
import {  Template,CaseViewModel,TemplateField , Case} from '../shared/models/caseModel';
import { DataService } from '../shared/services/dataService';
import {FormGroup, FormControl, Validators, FormBuilder  , ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import{PingCase} from '../shared/models/pingcase';
import{NotificationsService} from 'angular2-notifications';

@Component({
    selector:'case',
    templateUrl: './case.view.html'
})

export class CaseComponent implements OnInit {
    template:Template;
    dataModel:CaseViewModel;
    caseId:string;
    case:Case;
    field1 : Object;
   
    caseForm: FormGroup;

     interval:any;
    pingCase:PingCase;
    previousPingCase:PingCase;
    activeUsersFormat:string;
    userName:string;
    isValid:boolean;
    isNotifyEnabled:boolean;
    
    timeoutTag:any;

    public options = {
        timeOut: -1,
        lastOnBottom: true,
        clickToClose: true,
        maxLength: 0,
        maxStack: 7,
        showProgressBar: true,
        pauseOnHover: true,
        preventDuplicates: false,
        preventLastDuplicates: 'visible',
        rtl: false,
        animate: 'scale',
        position: ['right', 'bottom']
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: DataService,
        private formBuilder : FormBuilder,
        private notificationsService:NotificationsService

    ){
            this.userName='Rock';//Temporery code. Once SSO is implemented we'll make it dynamic.
           this.initializeFormControls();      
     
     }

   

    ngOnInit():void
    {
       
      this.caseId = this.route.snapshot.params['id'];
   
     this.NotifyActiveUsers(this.caseId,this.userName);

      this.service.getCaseInformation(this.caseId).then(
            resp => { this.getTemplateInformation(resp);
     
             }); 
 
            
          
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    } 

    NotifyActiveUsers(caseId: string, user: string): void {
        this.interval = setInterval(() => { this.GetPingResponse(caseId, user) }, 900);
    }

    GetPingResponse(caseId: string, user: string): void {
        this.service.PingCase(caseId).then(resp => { this.NotifyFormat(resp, caseId, user); });
    }

    NotifyFormat(resp: PingCase, caseId: string, user: string): void {
        this.isNotifyEnabled=false;
        this.pingCase = resp;
        
        if (this.previousPingCase == null) {
            this.previousPingCase = resp;
        }
        else if (this.ActiveUserCompare(this.previousPingCase.Data, resp.Data) == false) {
            this.previousPingCase = resp;
            this.notificationsService.remove();
        }

        this.activeUsersFormat = "<h4>Users working on this case.</h4>";
        this.activeUsersFormat += `<ul>`;

        for (let data in this.pingCase.Data) {
            if (data != user) {
                this.isNotifyEnabled=true;
                this.activeUsersFormat += '<li>' + data + '</li>';
            }
        }
        this.activeUsersFormat += "</ul>";

        if (this.isNotifyEnabled) 
        {
            this.notificationsService.html(this.activeUsersFormat, "info");
        }

    }

    ActiveUserCompare(prevActiveUser, curActiveUsers): boolean {
        var previousActiveUsers = Object.getOwnPropertyNames(prevActiveUser);
        var currentActiveUsers = Object.getOwnPropertyNames(curActiveUsers);

        if (previousActiveUsers.length != currentActiveUsers.length) {
            return false;
        }

        for (var i = 0; i < previousActiveUsers.length; i++) {
            var prevName = previousActiveUsers[i];
            var curName = currentActiveUsers[i];

            if (prevName !== curName) {
                return false;
            }
        }
        return true;
    }


    getTemplateInformation(respCase:Case) {
        this.case = respCase;     
        this.service.getTemplate(respCase.Template).then(
            t => {this.dataModel = {
                Template: t,
                changeset: {},
                Data: this.case.Data,
                IsDisplay: false,
                OnChange: this.onChange.bind(this)
            
          };
         
        } );

        
    }
    initializeFormControls():void
    {
             this.caseForm = this.formBuilder.group({
                            "NameofReviewer" : ["Reviewer 1",  Validators.required]   ,
                            "YearofDeath" : ["2016",  Validators.required],
                            "DateofDeath":["2017-04-05",  Validators.required]   ,
                            "CountyofDeath" : ["test",  Validators.required],
                            "ResidentCounty" : ["County 1", Validators.nullValidator],
                            "CauseofDeath" :["cause 1", Validators.nullValidator],
                            "Sex":["", Validators.nullValidator],
                            "Transgender":["", Validators.nullValidator],
                            "DateofBirth":["", Validators.nullValidator],
                            "Race":["", Validators.nullValidator],
                            "Hispanic":["", Validators.nullValidator],
                            "EMSRecords":["", Validators.nullValidator],
                            "PriorEMS":["", Validators.nullValidator],
                            "EMS_DayofDeath":["", Validators.nullValidator],
                             "HospitalRecords":["", Validators.nullValidator],
                            "CRISPRecords":["", Validators.nullValidator],
                            "PDMPRecords":["", Validators.nullValidator],
                             "EDEncounter":["", Validators.nullValidator],
                            "ED_DayofDeath":["", Validators.nullValidator],
                             "PainManagement":["", Validators.nullValidator],
                            "ChronicSomatic":["", Validators.nullValidator],
                            "BrainInjury":["", Validators.nullValidator],
                            "LawRecords":["", Validators.nullValidator],
                            "LawContact":["", Validators.nullValidator],
                             "LawSuspect":["", Validators.nullValidator],
                            "AttorneyRecords":["", Validators.nullValidator],
                             "DrugCourtRecords":["", Validators.nullValidator],
                             "AttorneyContact":["", Validators.nullValidator],
                            "DUIHistory":["", Validators.nullValidator],
                             "LawProsecuted":["", Validators.nullValidator],
                            "LawCharge":["", Validators.nullValidator],
                             "DetentionCenterRecords":["", Validators.nullValidator],
                            "DetentionCenterContact":["", Validators.nullValidator],
                             "EducationK12":["", Validators.nullValidator],
                            "EducationHigherEd":["", Validators.nullValidator],
                             "EducationContact":["", Validators.nullValidator],
                            "EducationDegree":["", Validators.nullValidator],
                               "BHHdRecords":["", Validators.nullValidator],
                            "BHPrivateRecords":["", Validators.nullValidator],
                             "BHMentalHealth":["", Validators.nullValidator],
                            "BHBeacon":["", Validators.nullValidator],
                             "BHHDContact":["", Validators.nullValidator],
                            "BHPrivateContact":["", Validators.nullValidator],
                             "BHTreatment":["", Validators.nullValidator],
                            "BHSuicide":["", Validators.nullValidator],
                            "CommunityRecords":["", Validators.nullValidator],
                             "CommunityContact":["", Validators.nullValidator],
                            "CommunityEnrollment":["", Validators.nullValidator],
                             "SSRecords":["", Validators.nullValidator],
                            "SSContact":["", Validators.nullValidator],
                             "SSEnrollment":["", Validators.nullValidator],
                            "SSCrisisRecords":["", Validators.nullValidator],
                              "FamilyInterviews":["", Validators.nullValidator],
                             "MaritalStatus":["", Validators.nullValidator],
                            "InmatePartner":["", Validators.nullValidator],
                             "HRMORPRecords":["", Validators.nullValidator],
                             "HRSterileSyringe":["", Validators.nullValidator],
                            "HRPeerRecovery":["", Validators.nullValidator],
                             "SexualOrientation":["", Validators.nullValidator],
                            "Pregnancy":["", Validators.nullValidator],
                             "Occupation":["", Validators.nullValidator],
                            "EmploymentStatus":["", Validators.nullValidator],
                              "Homeless":["", Validators.nullValidator],
                             "Military":["", Validators.nullValidator],
                            "Institution":["", Validators.nullValidator],
                             "DrugExposure":["", Validators.nullValidator],
                             "LocationOfDeathType":["", Validators.nullValidator],
                            "LocationofDeathOther":["", Validators.nullValidator],
                             "CaseSummary":["", Validators.nullValidator],
                             "CaseGaps1":["", Validators.nullValidator],
                            "CaseGaps2":["", Validators.nullValidator],
                             "CaseGaps3":["", Validators.nullValidator],
                            "CaseRecommendations1":["", Validators.nullValidator],
                              "CaseRecommendations1Category":["", Validators.nullValidator],
                             "CaseRecommendations1Target":["", Validators.nullValidator],
                            "CaseRecommendations1Agency":["", Validators.nullValidator],
                             "CaseRecommendations1Party":["", Validators.nullValidator],
                             "CaseRecommendations2":["", Validators.nullValidator],
                            "CaseRecommendations2Category":["", Validators.nullValidator],
                              "CaseRecommendations2Target":["", Validators.nullValidator],
                             "CaseRecommendations2Agency":["", Validators.nullValidator],
                            "CaseRecommendations2Party":["", Validators.nullValidator],
                             "CaseRecommendations3":["", Validators.nullValidator],
                             "CaseRecommendations3Category":["", Validators.nullValidator],
                            "CaseRecommendations3Target":["", Validators.nullValidator],
                             "CaseRecommendations3Agency":["", Validators.nullValidator],
                             "CaseRecommendations3Party":["", Validators.nullValidator],
                             "BHAReview":["", Validators.nullValidator],
                            "BHAFollowup":["", Validators.nullValidator]
                           
                           
                        });
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

     submit():void{
       
          if (this.caseForm.dirty && this.caseForm.valid) {
           this.service.submitCase(this.caseId, null).then(
             resp => console.log(resp.Result));
          }
          else{
              alert("Form is not valid");
          }
    }
}