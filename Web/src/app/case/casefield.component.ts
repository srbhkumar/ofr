import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Template, TemplateField, CaseViewModel } from '../shared/models/caseModel';
import { FormGroup, Form, FormControl, Validator, FormBuilder, NgModel } from '@angular/forms';
import { Case } from '../shared/models/caseModel';
@Component({
    selector: 'case-field',
    templateUrl: './caseField.html'
})



export class CaseFieldComponent implements OnChanges, OnInit {
    @Input() FieldName: string;
    @Input() ViewModel: CaseViewModel;
    @Input() form: FormGroup;




    Field: TemplateField;

    checkboxValue: boolean = null;
    checkboxVal : string = 'true';


    constructor() {
      
    }


    bindModel() {
        // var key;
        // for (key in this.ViewModel.Data) {
        //     if (this.ViewModel.Data.hasOwnProperty(key)) {
        //         this.form.controls[key].setValue(this.ViewModel.Data[key]);
        //     }
        // }
    }


    bindModelonInit() {
        var key;
        for (key in this.ViewModel.Data) {
            if(this.ViewModel.Template.Fields[key]){
            if(this.ViewModel.Template.Fields[key].Type.toString() == "Checkbox"){
                if(this.ViewModel.Data[key]) {
                    this.form.controls[key].valid == true;
                    console.log(this.form.controls[key].value);
                } 
            }
            else{
                if(this.ViewModel.Data[key]) {
                    console.log("it hit here");
                    this.form.controls[key].valid == true;
                    console.log(this.form.controls[key]);
                } 
                // else {
                //     this.form.controls[key].setValue(this.ViewModel.Data[key]);
                // }        
        }
        }
    }
    }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        //this.bindModel(); //Its also important to bind when the form first loads, to make sure the filled controls are already in valid state when the form first loads.
        this.bindModelonInit();
        if (!this.ViewModel.Data[this.FieldName])
            this.ViewModel.Data[this.FieldName] = null;

            
        
        
    }
   

    ngOnChanges(ch: SimpleChanges): void {
        if (!this.ViewModel || !this.ViewModel.Template) return;
        var fields = this.ViewModel.Template.Fields;
        for (var i = 0; i < fields.length; ++i) {
            if (fields[i].Name == this.FieldName) {
                this.Field = fields[i];
                // if(this.Field.Type == "Checkbox"){
                // console.log((this.ViewModel.Data["Transgender"] == this.checkboxVal));
                // }
                break;
            }
        }
    }

    //This peace of code (bindModel) does two way does template -> model data binding sice reactive forms do not support two way daat binding.
    //On each value change, all the value from ViewModel.Data will be assigned to each form control model, making them valid. This is required for succesful validation upon hitting 'Submit" button.



    setValue(val: number | string | boolean): void {
        //Calcaute year of death from Date of Death entered by user


        this.ViewModel.Data[this.FieldName] = val;

        this.ViewModel.changeset[this.FieldName] = val;
        this.ViewModel.OnChange();

        if (this.ViewModel.Data['DateofDeath']) {
            var dateOfDeath = this.ViewModel.Data['DateofDeath'];
            var yearOfDeath = Number(dateOfDeath.substr(0, 4));
            this.ViewModel.changeset['YearofDeath'] = yearOfDeath.toString();
            this.ViewModel.Data['YearofDeath'] = yearOfDeath.toString();
            this.ViewModel.OnChange();
        }

        //Calculare age from Date of Death and Date of Birth provided by the user
        if (this.ViewModel.Data['DateofDeath'] && this.ViewModel.Data['DateofBirth']) {
            var dateOfDeath = this.ViewModel.Data['DateofDeath'];
            var dateOfBirth = this.ViewModel.Data['DateofBirth'];
            // var age = dateOfBirth.getFullYear();
            var yearOfBirth = Number(dateOfBirth.substr(0, 4));
            var yearOfDeath = Number(dateOfDeath.substr(0, 4));
            if (yearOfDeath > yearOfBirth) {
                var age = yearOfDeath - yearOfBirth;
                this.ViewModel.changeset['AgeatDeath'] = age.toString();
                this.ViewModel.Data['AgeatDeath'] = age.toString();
                //make atemplate for Age or find a way to include Age in the final data getting submitted 
            }
            else {
                this.ViewModel.Data['AgeatDeath'] = "Invalid Data. Please make sure Date of Death is later than Date of Birth";
            }
        }
        this.bindModel();





        // todo: trigger saves
    }


    setTextValue(val: number | string | boolean): void {
        //Calcaute year of death from Date of Death entered by user


        this.ViewModel.Data[this.FieldName] = val;

        this.ViewModel.changeset[this.FieldName] = val;
        this.ViewModel.OnChange();

        if (this.ViewModel.Data['DateofDeath']) {
            var dateOfDeath = this.ViewModel.Data['DateofDeath'];
            var yearOfDeath = Number(dateOfDeath.substr(0, 4));
            this.ViewModel.changeset['YearofDeath'] = yearOfDeath.toString();
            //this.ViewModel.Data['YearofDeath'] = yearOfDeath.toString();
            this.ViewModel.OnChange();
            //this.bindModel();
        }

        //Calculare age from Date of Death and Date of Birth provided by the user
        if (this.ViewModel.Data['DateofDeath'] && this.ViewModel.Data['DateofBirth']) {
            var dateOfDeath = this.ViewModel.Data['DateofDeath'];
            var dateOfBirth = this.ViewModel.Data['DateofBirth'];
            // var age = dateOfBirth.getFullYear();
            var yearOfBirth = Number(dateOfBirth.substr(0, 4));
            var yearOfDeath = Number(dateOfDeath.substr(0, 4));
            if (yearOfDeath > yearOfBirth) {
                var age = yearOfDeath - yearOfBirth;
                this.ViewModel.changeset['AgeatDeath'] = age.toString();
                this.ViewModel.Data['AgeatDeath'] = age.toString();
                //make atemplate for Age or find a way to include Age in the final data getting submitted 
            }
            else {
                this.ViewModel.Data['AgeatDeath'] = "Invalid Data. Please make sure Date of Death is later than Date of Birth";
            }
        }
        this.bindModel();





        // todo: trigger saves
    }


    //code to update the selection in DocumentDB
    setCheckboxValue(val: number | string): boolean {
        if (this.ViewModel.Data[this.FieldName]=="True" || this.ViewModel.Data[this.FieldName]==true ){this.checkboxValue = true;  return this.checkboxValue }
        else if (this.ViewModel.Data[this.FieldName]=="False" || this.ViewModel.Data[this.FieldName]==false ){this.checkboxValue = false; return this.checkboxValue}
        else {this.checkboxValue = false; return this.checkboxValue}
    }


    public GetCheckedValue(value : string) :boolean
    
    {

        return value && value.toString().toLowerCase() == "true";
    }

    setCheckVal(val: number | string | boolean): void {
        //this.bindModel();
        //console.log(val);
        //console.log((this.ViewModel.Data[this.FieldName]));
        var p;
        if (this.ViewModel.Data[this.FieldName]=="True" || this.ViewModel.Data[this.FieldName]==true ){p = true}
        else if (this.ViewModel.Data[this.FieldName]=="False" || this.ViewModel.Data[this.FieldName]==false ){p = false}
        else {p = false}
        //console.log(p);
        this.ViewModel.Data[this.FieldName] = !p;
        this.ViewModel.changeset[this.FieldName] = !p;
        this.ViewModel.OnChange();
    }

    setRadioVal(val: number | string | boolean): void {
        this.bindModel();
        var currentVal = 2;
        this.ViewModel.Data[this.FieldName] = val;
        this.ViewModel.changeset[this.FieldName] = val;
        this.ViewModel.OnChange();
        // var p = this.ViewModel.Data[this.FieldName];
        // this.ViewModel.Data[this.FieldName] = !p;
        // this.ViewModel.changeset[this.FieldName] = !p;
        // this.ViewModel.OnChange();
    }
    
}