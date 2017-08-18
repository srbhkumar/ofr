import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Template, TemplateField, CaseViewModel } from '../shared/models/caseModel';
import {FormGroup,Form, FormControl,Validator, FormBuilder   } from '@angular/forms';
@Component({
    selector: 'case-field',
    templateUrl: './caseField.html'
})

export class CaseFieldComponent implements OnChanges {
    @Input() FieldName:string;
    @Input() ViewModel:CaseViewModel;
    @Input() form: FormGroup;
   
    
    Field:TemplateField;
  
    
    constructor(){
       
    }
    ngOnChanges(ch:SimpleChanges): void {   
        if (!this.ViewModel || !this.ViewModel.Template) return;
        var fields = this.ViewModel.Template.Fields;
        for(var i = 0; i < fields.length; ++i){
            if (fields[i].Name == this.FieldName){
                this.Field = fields[i];
                break;
            }
        }
    }

    setValue(val:number|string):void {
        this.ViewModel.Data[this.FieldName] = val;
        this.ViewModel.changeset[this.FieldName] = val;
        this.ViewModel.OnChange();
        // todo: trigger saves
    }
}