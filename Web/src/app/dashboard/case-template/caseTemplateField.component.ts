import { Component, OnInit, Input } from '@angular/core';
import { CaseData } from '../../shared/models/caseValidation';

import { Case } from '../../shared/models/caseModel';
@Component({
    selector: 'Case-Template-Field',
    templateUrl: '../case-template/caseTemplateField.component.html'
})

export class CaseTemplateFieldComponent implements OnInit {
    @Input() field: any;
    @Input() value: any;
    @Input() IsRequired: boolean;

    constructor() {
    }

    ngOnInit() {

        if (this.field.Type == 'Checkbox' && this.value) {
            this.value = (this.value.toString().toLowerCase() == 'true');
        }
        const isValid = !this.value && this.field.Required ? false : true;
        this.setValidationRule();
    }

    private setValidationRule(): void {
        CaseData.setCaseData({
            key: this.field.Name, IsRequired: this.field.Required,
            value: this.value, Type: this.field.Type
        });
    }

    private update(validationControl: any, value: any) {
        this.value = value;
        this.setValidationRule();
        CaseData.changeset[this.field.Name] = value;
        CaseData.OnChange();
    }

    private isValid(validationControl: any): boolean {
        if (validationControl.errors) {
            return this.isRequired(validationControl);
        }

        return true;
    }

    private isRequired(validationControl: any): boolean {
        if ((this.field.Type == 'Date' && this.field.Required
            && (!this.value && this.value.trim().length == 0))) {
            return false;
        } else if (this.field.Type == 'Date' && this.value && this.value.trim().length > 0) {
            return true;
        } else if (validationControl.errors.required && this.value) {
            return true;
        } else {
            return false;
        }
    }
}
