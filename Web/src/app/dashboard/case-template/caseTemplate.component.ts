import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../shared/services/dataService';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { NotificationsService } from 'angular2-notifications';
import { CaseData } from '../../shared/models/caseValidation';

@Component({
    selector: 'Case-Template',
    templateUrl: '../case-template/caseTemplate.component.html',
    styles: [' .error{color: #a94442; font-size: medium;}']
})
export class CaseTemplateComponent implements OnInit {
    private caseId: string;
    private modalData: any;
    private isModalDataLoaded: any;
    private modalGroups: any;
    private timeoutTag: any;
    private comparsionRule: any;

    private options = {
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

    constructor(private http: Http, private dataService: DataService, private saveNotificationService: NotificationsService, 
        private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        
        this.getCaseInformation();
    }

    private getCaseInformation(): void {
        this.caseId = this.route.snapshot.params['id'];
        this.dataService.getCaseInformation(this.caseId).then(x => this.response(x));
    }

    private response(resp: any): void {
        this.modalData = resp.Data;
        this.isModalDataLoaded = true;
        this.dataService.getTemplate(resp.Template).then(template => {
            this.modalGroups = template['Groups'];
            this.comparsionRule = template['Comparison'];
        });
        CaseData.OnChange = this.onChange.bind(this);
    }

    // public getTemplate() {
    //     debugger;
    //     return new Promise((resolve, reject) => {
    //         this.http.get('assets/case.json').map(res => res.json()).catch((error: any): any => {
    //             resolve(true);
    //             return Observable.throw(error.json().error || 'Server error');
    //         }).subscribe((data) => {
    //             this.modalGroups = data['Groups'];
    //             this.comparsionRule = data['Comparsion'];
    //         });

    //     });

    // }

    private getFieldValue(fieldName: string): any {
        if (this.modalData[fieldName]) {
            return this.modalData[fieldName]
        }
        return null;
    }

    private getActiveIds(): string {
        let activeids = '';
        for (let index = 0; index < this.modalGroups.length; index++) {
            activeids += 'ngb-panel-' + index + ',';
        }
        return activeids.replace(/,\s*$/, '');
    }

    private onChange(): void //SK_clears the timeout and saves the chanes
    {
        if (this.timeoutTag) {
            clearTimeout(this.timeoutTag);
        }

        this.timeoutTag = setTimeout(this.saveChanges.bind(this), 3 * 1000);
    }

    private saveChanges(): void {
        this.timeoutTag = null;
        const oldChanges = CaseData.changeset;
        CaseData.changeset = {};
        this.dataService.saveCase(this.caseId, oldChanges)
            .then(r => this.saveNotify())
            .catch(r => this.saveErrorNotify())//SK Check the code below and make sure the two catch bloacks are working fine.
            .catch(r => {
                for (var k in oldChanges) {
                    // pushing any changes back into the changeset
                    // ignore anything that's already been re-added (from new input)
                    if (CaseData.changeset[k]) continue;
                    CaseData.changeset[k] = oldChanges[k];
                }
            });
    }

    private saveNotify(): any {
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

    private saveErrorNotify(): any {
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

    private dateValidation(orignalValue: any, comparisonType: string, targetValue: any, type: string): boolean {
        let orignalDate;
        let targetDate;

        if (type == 'Date') {
            orignalDate = new Date(orignalValue).getTime();
            targetDate = new Date(targetValue).getTime();
        } else {
            orignalDate = orignalValue;
            targetDate = targetValue;
        }

        if (comparisonType == 'GT' && (orignalDate > targetDate)) {
            return true;
        } else if (comparisonType == 'GTE' && (orignalDate >= targetDate)) {
            return true;
        } else if (comparisonType == 'EQ' && (orignalDate == targetDate)) {
            return true;
        } else if (comparisonType == 'NEQ' && (orignalDate != targetDate)) {
            return true;
        } else if (comparisonType == 'LTE' && (orignalDate <= targetDate)) {
            return true;
        } else if (comparisonType == 'LT' && (orignalDate < targetDate)) {
            return true;
        }

        return false;
    }

    private isValidComparsionRule(): Array<string> {
        const errors = Array<string>();

        this.comparsionRule.forEach(rule => {
            const orignalValue = CaseData.getCaseData().filter(x => x.key == rule.Orignal).length > 0 ?
                CaseData.getCaseData().find(x => x.key == rule.Orignal).value : '';
            const targetValue = CaseData.getCaseData().filter(x => x.key == rule.Target).length > 0 ?
                CaseData.getCaseData().find(x => x.key == rule.Target).value : '';

            if (!this.dateValidation(orignalValue, rule.Operator, targetValue, rule.Type)) {
                errors.push(rule.Error);
            }
        });

        return errors;
    }

    private isValid(): boolean {
        if (this.isValidComparsionRule.length > 0) {
            return true;
        }
        return CaseData.isValid();
    }

    private  submit(): void {
        this.dataService.submitCase(this.caseId, null);
        this.router.navigate(['dashboard']);
    }
}
