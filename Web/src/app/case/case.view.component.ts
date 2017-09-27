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
    rec2SetVal: string;

    interval: any;
    pingCase: PingCase;
    previousPingCase: PingCase;
    activeUsersFormat: string;
    userName: string;
    isValid: boolean;
    isNotifyEnabled: boolean;

    timeoutTag: any;

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



    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
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
            "Race": ["", Validators.required],
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
            "MaritalStatus": ["", Validators.nullValidator],
            "IntimatePartnerViolence": ["", Validators.nullValidator],
            "IPVRole": ["", Validators.nullValidator],
            "DecedentChildren": ["", Validators.nullValidator],
            "HRMORPRecords": ["", Validators.nullValidator],
            "HRSterileSyringe": ["", Validators.nullValidator],
            //"HRPeerRecovery": ["", Validators.nullValidator],
            "SexualOrientation": ["", Validators.nullValidator],
            "Pregnancy": ["", Validators.nullValidator],
            "Occupation": ["", Validators.maxLength(50)],
            "EmploymentStatus": ["", Validators.nullValidator],
            "Homeless": ["", Validators.nullValidator],
            "Military": ["", Validators.nullValidator],
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
            "CaseRecommendations1Agency": ["", Validators.required],
            "CaseRecommendations1Party": ["", Validators.required],
            "CaseRecommendations2": ["", Validators.nullValidator],
            "CaseRecommendations2Category": ["", Validators.nullValidator],
            "CaseRecommendations2Target": ["", Validators.nullValidator],
            "CaseRecommendations2Agency": ["", Validators.nullValidator],
            "CaseRecommendations2Party": ["", Validators.nullValidator],
            "CaseRecommendations3": ["", Validators.nullValidator],
            "CaseRecommendations3Category": ["", Validators.nullValidator],
            "CaseRecommendations3Target": ["", Validators.nullValidator],
            "CaseRecommendations3Agency": ["", Validators.nullValidator],
            "CaseRecommendations3Party": ["", Validators.nullValidator],
            "BHAReview": ["", Validators.nullValidator],
            "BHAFollowup": ["", Validators.maxLength(280)]


        });

        this.caseForm.get('CaseRecommendations2').valueChanges.subscribe(
            (value: string) => {
                if (value != null) {
                    if (value !== "") {
                        this.caseForm.get('CaseRecommendations2Category').setValidators(Validators.required);
                        this.caseForm.get('CaseRecommendations2Target').setValidators(Validators.required);
                        this.caseForm.get('CaseRecommendations2Agency').setValidators(Validators.required);
                        this.caseForm.get('CaseRecommendations2Party').setValidators(Validators.required);
                    }
                    else {
                        this.caseForm.get('CaseRecommendations2Category').setValidators(Validators.nullValidator);
                        this.caseForm.get('CaseRecommendations2Target').setValidators(Validators.nullValidator);
                        this.caseForm.get('CaseRecommendations2Agency').setValidators(Validators.nullValidator);
                        this.caseForm.get('CaseRecommendations2Party').setValidators(Validators.nullValidator);
                    }
                }
            })
        

        this.caseForm.get('CaseRecommendations3').valueChanges.subscribe(
            (value: string) => {
                if (value != null) {
                    if (value !== "") {
                        this.caseForm.get('CaseRecommendations3Category').setValidators(Validators.required);
                        this.caseForm.get('CaseRecommendations3Target').setValidators(Validators.required);
                        this.caseForm.get('CaseRecommendations3Agency').setValidators(Validators.required);
                        this.caseForm.get('CaseRecommendations3Party').setValidators(Validators.required);
                    }
                    else {
                        this.caseForm.get('CaseRecommendations3Category').setValidators(Validators.nullValidator);
                        this.caseForm.get('CaseRecommendations3Target').setValidators(Validators.nullValidator);
                        this.caseForm.get('CaseRecommendations3Agency').setValidators(Validators.nullValidator);
                        this.caseForm.get('CaseRecommendations3Party').setValidators(Validators.nullValidator);
                    }
                }
            })

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

        //SK_ Had to set the value of all the controls to make the Status of individual control and the FormGroup 'Valid'. Dont know why the angular resets the value of each control to empty, making the control and from status 'Invalid'
        //Once above line's function is achieved, just check to see if the form is valid and save the result.
        var key;
        for (key in this.case.Data) {
            if (this.case.Data.hasOwnProperty(key)) {
                this.caseForm.controls[key].setValue(this.case.Data[key]);
            }
        }

        //Actual form submission/
        var i, field
        field = this.dataModel.Template.Fields;
        if (this.caseForm.valid) {
            this.service.submitCase(this.caseId, null).then(
                resp => console.log(resp.Result));
            this.router.navigate(['dashboard']);
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