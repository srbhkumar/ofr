import { Component, Input, OnInit } from '@angular/core';
import { RequiredFieldGroup, CaseData } from '../../shared/models/caseValidation';

@Component({
  selector: 'Case-Template-Group',
  templateUrl: '../case-template/caseTemplateGroup.component.html'
})
export class CaseTemplateGroupComponent implements OnInit {
    @Input() filed1: any;
    @Input() ParentTitle: string;
    @Input() Title: string;
    @Input() modalData: any;
    @Input() IsGroupRequired: boolean;
    @Input() AllRequired: boolean;
    @Input() Required: boolean;
    @Input() IsChild: boolean;

    constructor() {
    }

    ngOnInit() {
        if (this.AllRequired) {
            this.recursive(this.filed1, '', this.AllRequired);
        } else if (this.Required) {
            this.recursive(this.filed1, this.Title, false);
        }
    }

    private recursive(data: any, subGroupTitle: string, isAllRequired: boolean) {
        data.forEach(item => {
            if (item.InnerGroup) {
                this.recursive(item.InnerGroup, item.Title, isAllRequired);
            } else {
                RequiredFieldGroup.addRequiredGroup(this.Title, item.Type, item.Name, subGroupTitle, isAllRequired);
            }
        });
    }

    private getFieldValue(fieldName: string): any {
        if (this.modalData[fieldName]) {
            return this.modalData[fieldName];
        }
        return '';
    }

    private isRequiredGroupValid(groupName: string): boolean {
        if (!this.AllRequired && !this.Required) {
            return false;
        }
        const isValid = RequiredFieldGroup.isRequiredGroupValid(this.Title);
        if (!this.IsChild) {
            CaseData.setCaseData({ key: groupName, IsGroupValid: !isValid });
        }

        return isValid;
    }

    private isInnerGroupValid(parentGroupName: string, groupName: string): boolean {
        return RequiredFieldGroup.isInnerGroupValid(parentGroupName, groupName);
    }
}
