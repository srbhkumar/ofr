import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Template, CaseViewModel, TemplateField, Case } from '../shared/models/caseModel';
import { DataService } from '../shared/services/dataService';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { PingCase } from '../shared/models/pingcase';
import { NotificationsService } from 'angular2-notifications';


@Component({
    selector: 'case',
    templateUrl: './case.view.html',
    styles: [`
    select.ng-invalid {border-left: 5px solid red;}`]
})

export class CaseComponent implements OnInit {
    template: Template;
    dataModel: CaseViewModel;
    caseId: string;
    case: Case;
    field1: Object;
    caseForm: FormGroup;
    interval: any;
    pingCase: PingCase;
    previousPingCase: PingCase;
    activeUsersFormat: string;
    userName: string;
    isValid: boolean;
    isNotifyEnabled: boolean;
    msgRaceHide : boolean = true;
    msgRecommendation1AgencyHide: boolean = true;
    msgRecommendation1PartyHide: boolean = true;
    msgAgencyHide: boolean = true;
    msgPartyHide: boolean = true;
    recommendation2Hide = { msgAgencyHide: true, msgPartyHide: true };
    msgRecommendation3AgencyHide: boolean = true;
    msgRecommendation3PartyHide: boolean = true;
    recommendation3Hide = { msgAgencyHide: true, msgPartyHide: true };
    timeoutTag: any;

    rec2ControlArray = ["CaseRecommendations2", "CaseRecommendations2Category", "CaseRecommendations2Target"];
    rec3ControlArray = ["CaseRecommendations3", "CaseRecommendations3Category", "CaseRecommendations3Target"];
    CaseRecommendations2AgencyArray = ["CaseRecommendations2AgencyLaw enforcement", "CaseRecommendations2AgencyHospital", "CaseRecommendations2AgencyHealthcare Provider", "CaseRecommendations2AgencyPharmacy", "CaseRecommendations2AgencyJudicial System", "CaseRecommendations2AgencyLocal Health Department", "CaseRecommendations2AgencyEMS", "CaseRecommendations2AgencyDetention Center", "CaseRecommendations2AgencyEducation", "CaseRecommendations2AgencyBehavioral Health"];
    CaseRecommendations2PartyArray = ["CaseRecommendations2PartyLocal", "CaseRecommendations2PartyState"];
    CaseRecommendations3AgencyArray = ["CaseRecommendations3AgencyLaw enforcement", "CaseRecommendations3AgencyHospital", "CaseRecommendations3AgencyHealthcare Provider", "CaseRecommendations3AgencyPharmacy", "CaseRecommendations3AgencyJudicial System", "CaseRecommendations3AgencyLocal Health Department", "CaseRecommendations3AgencyEMS", "CaseRecommendations3AgencyDetention Center", "CaseRecommendations3AgencyEducation", "CaseRecommendations3AgencyBehavioral Health"];
    CaseRecommendations3PartyArray = ["CaseRecommendations3PartyLocal", "CaseRecommendations3PartyState"];


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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: DataService,
        private formBuilder: FormBuilder,
        private notificationsService: NotificationsService,
        private saveNotificationService: NotificationsService,


    ) {
        this.userName = 'Rock';//Temporery code. Once SSO is implemented we'll make it dynamic.
        this.initializeFormControls();

    }



    ngOnInit(): void {

        this.caseId = this.route.snapshot.params['id'];
        //this.NotifyActiveUsers(this.caseId, this.userName); //This is Temporarily commented out for demo by Mike. We can restore it later/
        this.service.getCaseInformation(this.caseId).then(
            resp => {
                this.getTemplateInformation(resp);
            });


        this.ValidateRecommendation1();
        this.ValidateRace();


//Function calls for Validating Race. To make them multi select

        this.caseForm.get('RaceWhite').valueChanges.subscribe(
            () => { this.ValidateRace() });
        this.caseForm.get('RaceBlack or African American').valueChanges.subscribe(
            () => { this.ValidateRace() });
        this.caseForm.get('RaceAsian').valueChanges.subscribe(
            () => { this.ValidateRace() });
        this.caseForm.get('RaceNative Hawaiian or other Pacific Islander').valueChanges.subscribe(
            () => { this.ValidateRace() });
        this.caseForm.get('RaceNative Hawaiian or other Pacific Islander').valueChanges.subscribe(
            () => { this.ValidateRace() });
        this.caseForm.get('RaceAmerican Indian or Alaska Native').valueChanges.subscribe(
            () => { this.ValidateRace() });
        this.caseForm.get('RaceUnspecified race').valueChanges.subscribe(
            () => { this.ValidateRace() });




        //Function calls for updating CaseRecommendation1 Agency and Party  controls. To make them multi select

        this.caseForm.get('CaseRecommendations1AgencyLaw enforcement').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyHospital').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyHealthcare Provider').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyPharmacy').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyJudicial System').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyLocal Health Department').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyEMS').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyDetention Center').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyEducation').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1AgencyBehavioral Health').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1PartyLocal').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });
        this.caseForm.get('CaseRecommendations1PartyState').valueChanges.subscribe(
            () => { this.ValidateRecommendation1() });


        //Function calls for updating CaseRecommendation2 group of controls. 
        this.caseForm.get('CaseRecommendations2').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2Category').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2Target').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyLaw enforcement').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyHospital').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyHealthcare Provider').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyPharmacy').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyJudicial System').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyLocal Health Department').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyEMS').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyDetention Center').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyEducation').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2AgencyBehavioral Health').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2PartyLocal').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });
        this.caseForm.get('CaseRecommendations2PartyState').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec2ControlArray, this.CaseRecommendations2AgencyArray, this.CaseRecommendations2PartyArray, this.recommendation2Hide) });



        //Function calls for updating CaseRecommendation3 group of controls. 
        this.caseForm.get('CaseRecommendations3').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3Category').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3Target').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyLaw enforcement').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyHospital').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyHealthcare Provider').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyPharmacy').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyJudicial System').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyLocal Health Department').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyEMS').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyDetention Center').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyEducation').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3AgencyBehavioral Health').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3PartyLocal').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });
        this.caseForm.get('CaseRecommendations3PartyState').valueChanges.subscribe(
            () => { this.updateValidatorRecommendation(this.rec3ControlArray, this.CaseRecommendations3AgencyArray, this.CaseRecommendations3PartyArray, this.recommendation3Hide) });


    }


    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    ValidateRecommendation1() {
        var CaseRecommendations1AgencyArray = ["CaseRecommendations1AgencyLaw enforcement", "CaseRecommendations1AgencyHospital", "CaseRecommendations1AgencyHealthcare Provider", "CaseRecommendations1AgencyPharmacy", "CaseRecommendations1AgencyJudicial System", "CaseRecommendations1AgencyLocal Health Department", "CaseRecommendations1AgencyEMS", "CaseRecommendations1AgencyDetention Center", "CaseRecommendations1AgencyEducation", "CaseRecommendations1AgencyBehavioral Health"];
        var CaseRecommendations1PartyArray = ["CaseRecommendations1PartyLocal", "CaseRecommendations1PartyState"];

        this.msgRecommendation1AgencyHide = false;
        this.msgRecommendation1PartyHide = false;
        var CaseRecommendations1Agencytouched = false;
        var CaseRecommendations1Partytouched = false;

        for (var j = 0; j <= CaseRecommendations1PartyArray.length - 1; j++) {
            if ((this.caseForm.controls[CaseRecommendations1PartyArray[j]].value == "True") || (this.caseForm.controls[CaseRecommendations1PartyArray[j]].value == true)) {
                this.msgRecommendation1PartyHide = true;
                CaseRecommendations1Partytouched = true;
                break;
            }
        }

        for (var j = 0; j <= CaseRecommendations1AgencyArray.length - 1; j++) {
            if ((this.caseForm.controls[CaseRecommendations1AgencyArray[j]].value == "True") || (this.caseForm.controls[CaseRecommendations1AgencyArray[j]].value == true)) {
                this.msgRecommendation1AgencyHide = true;
                CaseRecommendations1Agencytouched = true;
                break;
            }
        }


        (CaseRecommendations1Partytouched ? this.msgRecommendation1PartyHide = true : this.msgRecommendation1PartyHide = false);
        (CaseRecommendations1Agencytouched ? this.msgRecommendation1AgencyHide = true : this.msgRecommendation1AgencyHide = false);

    }


    ValidateRace() {
        var raceArray = ["RaceWhite", "RaceBlack or African American" , "RaceAsian" ,"RaceNative Hawaiian or other Pacific Islander" ,"RaceAmerican Indian or Alaska Native", "RaceUnspecified race"];

        this.msgRaceHide = false;
        var raceTouched;

        for (var j = 0; j <= raceArray.length - 1; j++) {
            if ((this.caseForm.controls[raceArray[j]].value == "True") || (this.caseForm.controls[raceArray[j]].value == true)) {
                this.msgRaceHide = true;
                raceTouched = true;
                break;
            }
        }
         (raceTouched ? this.msgRaceHide = true : this.msgRaceHide = false);

    }


    updateValidatorRecommendation(controlArray: string[], agencyArray: string[], partyArray: string[], model: any) {


        var AgencyEmpty = true;
        var PartyEmpty = true;

        var isempty = true;
        model.msgPartyHide = true;
        model.msgAgencyHide = true;
        var Agencytouched = false;
        var Partytouched = false;


        for (var j = 0; j <= controlArray.length - 1; j++) {
            if (this.caseForm.controls[controlArray[j]].value) {
                isempty = false;
                break;
            }
        }

        for (var j = 0; j <= partyArray.length - 1; j++) {
            if ((this.caseForm.controls[partyArray[j]].value == "True") || (this.caseForm.controls[partyArray[j]].value == true)) {
                isempty = false;
                PartyEmpty = false;
                model.msgPartyHide = true;
                Partytouched = true;
                break;
            }
        }

        for (var j = 0; j <= agencyArray.length - 1; j++) {
            if ((this.caseForm.controls[agencyArray[j]].value == "True") || (this.caseForm.controls[agencyArray[j]].value == true)) {
                isempty = false;
                AgencyEmpty = false;
                model.msgAgencyHide = true;
                Agencytouched = true;
                break;
            }
        }

        if (isempty == false) {

            (Partytouched ? model.msgPartyHide = true : model.msgPartyHide = false);
            (Agencytouched ? model.msgAgencyHide = true : model.msgAgencyHide = false);
        }

        for (var j = 0; j <= controlArray.length - 1; j++) {
            this.caseForm.controls[controlArray[j]].setValidators(isempty ? Validators.nullValidator : Validators.required);
            this.caseForm.controls[controlArray[j]].updateValueAndValidity({ emitEvent: false });
        }
    }


    NotifyActiveUsers(caseId: string, user: string): void {

        this.interval = setInterval(() => { this.GetPingResponse(caseId, user) }, 60 * 1000);
        //SK setInterval
    }

    GetPingResponse(caseId: string, user: string): void {

        this.service.PingCase(caseId).then(resp => { this.NotifyFormat(resp, caseId, user); });
    }

    NotifyFormat(resp: PingCase, caseId: string, user: string): void {

        this.isNotifyEnabled = false;
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

        for (let data in this.pingCase.Data["Response"]) {
            if (data != undefined) {
                this.isNotifyEnabled = true;
                this.activeUsersFormat += '<li>' + data + '</li>';
            }
        }

        this.activeUsersFormat += "</ul>";

        if (this.isNotifyEnabled) {
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

    getTemplateInformation(respCase: Case) {
        this.case = respCase;
        this.service.getTemplate(respCase.Template).then(
            t => {
                this.dataModel = {
                    Template: t,
                    changeset: {},
                    Data: this.case.Data,
                    IsDisplay: false,
                    OnChange: this.onChange.bind(this)

                };
            }).then(() => {
                var key;
                for (key in this.caseForm.controls) {
                    if (this.case.Data.hasOwnProperty(key)) {
                        this.caseForm.controls[key].setValue(this.case.Data[key]);

                    }
                    // else{
                    // this.caseForm.controls[key].setValue(null);
                    // }
                }
            });



    }


    initializeFormControls(): void {
        this.caseForm = this.formBuilder.group({
            "NameofReviewer": ["Reviewer 1", Validators.required],
            "DateofInitialCaseReview": ["", Validators.required],
            "DateofDeath": ["", Validators.required],
            "YearofDeath": ["", Validators.required],
            "CountyofDeath": ["", Validators.required],
            "ResidentJurisdiction": ["", Validators.required],
            "CauseofDeath": ["", Validators.nullValidator],
            "MannerofDeath": ["", Validators.required],
            "Sex": ["", Validators.required],
            "Transgender": ["", Validators.nullValidator],
            "DateofBirth": ["", Validators.required],
            "AgeatDeath": ["", Validators.required],
            //"Race": ["", Validators.required],
            "RaceWhite": ["", Validators.nullValidator],
            "RaceBlack or African American": ["", Validators.nullValidator],
            "RaceAsian": ["", Validators.nullValidator],
            "RaceNative Hawaiian or other Pacific Islander": ["", Validators.nullValidator],
            "RaceAmerican Indian or Alaska Native": ["", Validators.nullValidator],
            "RaceUnspecified race": ["", Validators.nullValidator],
            "Hispanic": ["", Validators.required],
            "EMSRecords": ["", Validators.nullValidator],
            "PriorEMS": ["", Validators.nullValidator],
            "EMS_DayofDeath": ["", Validators.nullValidator],
            "HospitalRecords": ["", Validators.nullValidator],
            "CRISPRecords": ["", Validators.nullValidator],
            "PDMPRecords": ["", Validators.nullValidator],
            "PharmacyRecords": ["", Validators.nullValidator],
            "EDEncounter": ["", Validators.nullValidator],
            //"ED_DayofDeath": ["", Validators.nullValidator],
            "PainManagement": ["", Validators.nullValidator],
            "ChronicSomatic": ["", Validators.nullValidator],
            "BrainInjury": ["", Validators.nullValidator],
            "LawRecords": ["", Validators.nullValidator],
            "LawContact": ["", Validators.nullValidator],
            "LawSuspect": ["", Validators.nullValidator],
            "LawLEAD": ["", Validators.nullValidator],
            "AttorneyRecords": ["", Validators.nullValidator],
            "DrugCourtRecords": ["", Validators.nullValidator],
            "AttorneyContact": ["", Validators.nullValidator],
            "DUIHistory": ["", Validators.nullValidator],
            "DrugCourtContact": ["", Validators.nullValidator],
            "LawProsecuted": ["", Validators.nullValidator],
            "LawCharge": ["", Validators.maxLength(50)],
            "DetentionCenterRecords": ["", Validators.nullValidator],
            "DetentionCenterContact": ["", Validators.nullValidator],
            "DetentionCenterDrugTreatment": ["", Validators.nullValidator],
            "DetentionCenterMHTreatment": ["", Validators.nullValidator],
            "EducationK12": ["", Validators.nullValidator],
            "EducationHigherEd": ["", Validators.nullValidator],
            "EducationContact": ["", Validators.nullValidator],
            "EducationDegree": ["", Validators.nullValidator],
            "BHHdRecords": ["", Validators.nullValidator],
            "BHPrivateRecords": ["", Validators.nullValidator],
            "BHTreatmentatDeath": ["", Validators.nullValidator],
            "BHMAT": ["", Validators.nullValidator],
            "BHMentalHealth": ["", Validators.nullValidator],
            "BHBeacon": ["", Validators.nullValidator],
            "BHHDContact": ["", Validators.nullValidator],
            "BHPrivateContact": ["", Validators.nullValidator],
            "BHTreatment": ["", Validators.nullValidator],
            "BHSuicide": ["", Validators.nullValidator],
            "CommunityRecords": ["", Validators.nullValidator],
            "CommunityContact": ["", Validators.nullValidator],
            "CommunityEnrollment": ["", Validators.nullValidator],
            "SSrecords": ["", Validators.nullValidator],
            "SSContact": ["", Validators.nullValidator],
            "SSEnrollment": ["", Validators.nullValidator],
            "SSCrisisRecords": ["", Validators.nullValidator],
            "FamilyInterviews": ["", Validators.nullValidator],
            "FamilyInterviewsDetails": ["", Validators.nullValidator],
            "MaritalStatus": ["", Validators.nullValidator],
            "IntimatePartnerViolence": ["", Validators.nullValidator],
            "IPVRole": ["", Validators.nullValidator],
            "DecedentChildren": ["", Validators.nullValidator],
            "HRMORPRecords": ["", Validators.nullValidator],
            "HRSterileSyringe": ["", Validators.nullValidator],
            //"HRPeerRecovery": ["", Validators.nullValidator],
            "PreviousOverdose": ["", Validators.nullValidator],
            "SexualOrientation": ["", Validators.nullValidator],
            "Pregnancy": ["", Validators.nullValidator],
            "Occupation": ["", Validators.maxLength(50)],
            "EmploymentStatus": ["", Validators.nullValidator],
            "Homeless": ["", Validators.nullValidator],
            "Military": ["", Validators.nullValidator],
            "SexWork": ["", Validators.nullValidator],
            "Institution": ["", Validators.nullValidator],
            "InstitutionOther": ["", Validators.maxLength(50)],
            "DrugExposure": ["", Validators.nullValidator],
            "LocationOfDeathType": ["", Validators.nullValidator],
            "LocationofDeathOther": ["", Validators.maxLength(100)],
            "NaloxoneAdministered": ["", Validators.nullValidator],
            "NaloxoneAdministratorBystander": ["", Validators.nullValidator],
            "NaloxoneAdministratorProfessionalFirstResponder": ["", Validators.nullValidator],
            "NaloxoneAdministratorOther": ["", Validators.nullValidator],
            "NaloxoneAdministratorOtherUnknown": ["", Validators.nullValidator],
            "Delay911": ["", Validators.nullValidator],
            "IVuseIndicatedScene": ["", Validators.nullValidator],
            "PrescriptionPillsonScene": ["", Validators.nullValidator],
            "CaseSummary": ["", Validators.compose([Validators.required, Validators.maxLength(3500)])],
            "CaseGaps1": ["", Validators.compose([Validators.required, Validators.maxLength(250)])],
            "CaseGaps2": ["", Validators.maxLength(250)],
            "CaseGaps3": ["", Validators.maxLength(250)],
            "CaseRecommendations1": ["", Validators.compose([Validators.required, Validators.maxLength(250)])],
            "CaseRecommendations1Category": ["", Validators.required],
            "CaseRecommendations1Target": ["", Validators.required],
            // "CaseRecommendations1Agency": ["", Validators.required],
            "CaseRecommendations1AgencyLaw enforcement": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyHospital": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyHealthcare Provider": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyPharmacy": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyJudicial System": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyLocal Health Department": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyEMS": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyDetention Center": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyEducation": ["", Validators.nullValidator],
            "CaseRecommendations1AgencyBehavioral Health": ["", Validators.nullValidator],
            // "CaseRecommendations1Party": ["", Validators.required],
            "CaseRecommendations1PartyLocal": ["", Validators.nullValidator],
            "CaseRecommendations1PartyState": ["", Validators.nullValidator],
            "CaseRecommendations2": ["", Validators.nullValidator],
            "CaseRecommendations2Category": ["", Validators.nullValidator],
            "CaseRecommendations2Target": ["", Validators.nullValidator],
            // "CaseRecommendations2Agency": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyLaw enforcement": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyHospital": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyHealthcare Provider": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyPharmacy": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyJudicial System": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyLocal Health Department": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyEMS": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyDetention Center": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyEducation": ["", Validators.nullValidator],
            "CaseRecommendations2AgencyBehavioral Health": ["", Validators.nullValidator],
            // "CaseRecommendations2Party": ["", Validators.nullValidator],
            "CaseRecommendations2PartyLocal": ["", Validators.nullValidator],
            "CaseRecommendations2PartyState": ["", Validators.nullValidator],
            "CaseRecommendations3": ["", Validators.nullValidator],
            "CaseRecommendations3Category": ["", Validators.nullValidator],
            "CaseRecommendations3Target": ["", Validators.nullValidator],
            //"CaseRecommendations3Agency": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyLaw enforcement": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyHospital": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyHealthcare Provider": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyPharmacy": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyJudicial System": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyLocal Health Department": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyEMS": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyDetention Center": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyEducation": ["", Validators.nullValidator],
            "CaseRecommendations3AgencyBehavioral Health": ["", Validators.nullValidator],
            //"CaseRecommendations3Party": ["", Validators.nullValidator],
            "CaseRecommendations3PartyLocal": ["", Validators.nullValidator],
            "CaseRecommendations3PartyState": ["", Validators.nullValidator],
            "BHAReview": ["", Validators.nullValidator],
            "BHAFollowup": ["", Validators.maxLength(280)]




        });

    }


    onChange(): void //SK_clears the timeout and saves the chanes
    {
        if (this.timeoutTag) {
            clearTimeout(this.timeoutTag);
        }

        this.timeoutTag = setTimeout(this.saveChanges.bind(this), 3 * 1000);
    }

    saveChanges(): void {
        this.timeoutTag = null;
        var oldChanges = this.dataModel.changeset;
        this.dataModel.changeset = {};
        this.service.saveCase(this.caseId, oldChanges)
            .then(r => this.saveNotify())
            .catch(r => this.saveErrorNotify())//SK Check the code below and make sure the two catch bloacks are working fine.
            .catch(r => {
                for (var k in oldChanges) {
                    // pushing any changes back into the changeset
                    // ignore anything that's already been re-added (from new input)
                    if (this.dataModel.changeset[k]) continue;
                    this.dataModel.changeset[k] = oldChanges[k];
                }
            });
    }

    saveNotify(): any {
        this.saveNotificationService.success(
            "Saved",
            "Changes Successfully Saved",
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


    saveErrorNotify(): any {
        this.saveNotificationService.error(
            "Error!",
            "Changes could not be saved.",
            {
                //SK_These options override the options set for ping notification
                id: 2,
                position: ["top", "right"],
                timeOut: 3 * 1000,
                maxStack: 3,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true,
            }
        );
    }



    submit(): void {

        //Actual form submission/
        var alertUser = true;
        if ((this.recommendation2Hide.msgAgencyHide) && (this.recommendation2Hide.msgPartyHide) && (this.recommendation3Hide.msgPartyHide) && (this.recommendation3Hide.msgPartyHide) && (this.msgRecommendation1PartyHide) && (this.msgRecommendation1AgencyHide)) {
            var alertUser = false;
        }
        var i, field
        field = this.dataModel.Template.Fields;

        if (this.caseForm.valid && !alertUser && this.msgRaceHide) {
            this.service.submitCase(this.caseId, null);
            this.router.navigate(['dashboard']);
        }

        else if (!this.msgRaceHide) {
            alert("Race is a required field. Please select atleast one race.")
        }

        else if (alertUser) {
            alert("Please fill all Recommendation fields.")
        }

            
        else {
            var errorMsg = "";
            for (i = 0; i < field.length - 1; i++) {
                if (!this.caseForm.controls[field[i].Name].valid) {

                    if (this.dataModel.Template.Fields[i].Type.toString() == "Textarea") {
                        errorMsg = errorMsg + "\"" + this.dataModel.Template.Fields[i].Description.toString() + "\" is a required text field. Please make sure it's filled and is within the character limits.\n";
                    }

                    if (this.dataModel.Template.Fields[i].Type.toString() == "Text") {
                        errorMsg = errorMsg + "\"" + this.dataModel.Template.Fields[i].Description.toString() + "\" is a required text field. Please make sure it's filled and is within the character limits.\n";
                    }
                    if (this.dataModel.Template.Fields[i].Type.toString() == "TextAreaBig") {
                        errorMsg = errorMsg + "\"" + this.dataModel.Template.Fields[i].Description.toString() + "\" is a required text field. Please make sure it's filled and is within the character limits.\n";
                    }
                    else {
                        errorMsg = errorMsg + "\"" + this.dataModel.Template.Fields[i].Description.toString() + "\" is a required field. Please make sure it's filled.\n";
                    }

                }
            }
            alert(errorMsg);
        }
    }
}

