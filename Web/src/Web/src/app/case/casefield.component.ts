import { Component, OnInit, Input } from '@angular/core';
import { Template, TemplateField, CaseViewModel } from './ofr';

@Component({
    selector: 'case-field',
    templateUrl: './CaseField.html'
})

export class CaseFieldComponent implements OnInit {
     @Input() FieldName:string;
    @Input() ViewModel:CaseViewModel;
    Field:TemplateField;

constructor()
{
   //this.template=new Template();
}

    ngOnInit(): void {
          for(var i = 0; i < this.ViewModel.Template.Fields.length; ++i)
        {
            if (this.ViewModel.Template.Fields[i].Name == this.FieldName)
            {
                this.Field = this.ViewModel.Template.Fields[i];
                break;
            }
        }
    }

   setValue(val:any):void
    {
        this.ViewModel.Data[this.FieldName] = val;
        this.ViewModel.changeset[this.FieldName] = val;
        // todo: trigger saves
    }
}