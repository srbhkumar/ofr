import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Template, TemplateField, CaseViewModel } from '../shared/models/caseModel';
import { FormGroup, Form, FormControl, Validator, FormBuilder, NgModel } from '@angular/forms';
import { Case } from '../shared/models/caseModel';
@Component({
    selector: 'case-field',
    templateUrl: './caseField.html'
})

export class CaseFieldComponent implements OnChanges {
    @Input() FieldName: string;
    @Input() ViewModel: CaseViewModel;
    @Input() form: FormGroup;

    


    Field: TemplateField;

    checkboxValue: boolean = false;


    constructor() {

    }
    ngOnChanges(ch: SimpleChanges): void {
        if (!this.ViewModel || !this.ViewModel.Template) return;
        var fields = this.ViewModel.Template.Fields;
        for (var i = 0; i < fields.length; ++i) {
            if (fields[i].Name == this.FieldName) {
                this.Field = fields[i];
                // debugger;
                // console.log("it hit here" + i);

                break;
            }
        }
    }


    setValue(val: number | string | boolean): void {

        this.ViewModel.Data[this.FieldName] = val;
        this.ViewModel.changeset[this.FieldName] = val;
        this.ViewModel.OnChange();

        if (this.ViewModel.Data['DateofDeath'] && this.ViewModel.Data['DateofBirth']) {
            var dateOfDeath = this.ViewModel.Data['DateofDeath'];
            var dateOfBirth = this.ViewModel.Data['DateofBirth'];
            // var age = dateOfBirth.getFullYear();
            var yearOfBirth = Number(dateOfBirth.substr(0, 4));
            var yearOfDeath = Number(dateOfDeath.substr(0, 4));
            if (yearOfDeath > yearOfBirth) {
                var age = yearOfDeath - yearOfBirth;
                console.log(age);
                this.ViewModel.Data['AgeatDeath'] = age;
                //make atemplate for Age or find a way to include Age in the final data getting submitted 
            }
        }
        // todo: trigger saves
    }

    //code to update the selection in DocumentDB
    setCheckboxValue(val: number | string): void {
        console.log(this.ViewModel.Data[this.FieldName]);
        if(!this.ViewModel.Data[this.FieldName])
            {
                console.log(this.ViewModel.Data);
                this.ViewModel.Data[this.FieldName].property = true;
                //this.ViewModel.Data.JSON,parse();
            }
        var p = this.ViewModel.Data[this.FieldName];
        for (var key in p) {
            if (key === val) {
                p[key] = !p[key];
            }
        }
        this.ViewModel.changeset[this.FieldName] = p;
        this.ViewModel.OnChange();
    }


    setCheckVal(val: number | string | boolean): void {

        var p = this.ViewModel.Data[this.FieldName];
        this.ViewModel.Data[this.FieldName] = !p;
        this.ViewModel.changeset[this.FieldName] = !p;
        this.ViewModel.OnChange();
    }

    setRadioVal(val: number | string | boolean): void {
                console.log("radioNewVal" + typeof(val));
                console.log("RadioCrrentVal" + this.ViewModel.Data[this.FieldName])
                var currentVal = 2;
                console.log(currentVal);
                this.ViewModel.Data[this.FieldName] = val;
                this.ViewModel.changeset[this.FieldName] = val;
                this.ViewModel.OnChange();
                // var p = this.ViewModel.Data[this.FieldName];
                // this.ViewModel.Data[this.FieldName] = !p;
                // this.ViewModel.changeset[this.FieldName] = !p;
                // this.ViewModel.OnChange();
            }
}