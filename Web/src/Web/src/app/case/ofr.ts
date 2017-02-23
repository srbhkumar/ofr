export class Template {
    id:string;
    Name:string;
    Description:string;
    Layout:string;
    Fields:TemplateField[];
};

export class TemplateField {
    Name:string;
    Description:string;
    Type:string;
    Required:boolean;
    Options:Array<string>;   
};

export class CaseViewModel
{
    Template:Template;
    Data:any;
    IsDisplay:boolean;
    changeset:any;
}