import { Component, OnInit, Input } from '@angular/core';
import { Template, TemplateField, CaseViewModel } from '../shared/models/ofr';

@Component({
    selector: 'case-field',
    templateUrl: './CaseField.html'
})

export class CaseFieldComponent implements OnInit {
    @Input() FieldName:string;
    @Input() ViewModel:CaseViewModel;
    Field:TemplateField;
    
    constructor(){}
    ngOnInit(): void {
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
        // todo: trigger saves
    }
}