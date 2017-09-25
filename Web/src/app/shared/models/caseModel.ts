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
    Length:string;
    Options:Array<string>; 
};

export class CaseViewModel
{
    Template:Template;
    Data:any;
    IsDisplay:boolean;
    changeset:any;
    OnChange:()=>void;
}

export class Dashboard
{
    total: number;
    cases: Case[];
    page: number;
}


export class OFRResponse
{
    Result:string;
    ErrorMessage:string[];
    Extra:any;
}

export class Case
{
  id: string;
  OCME: string;
  Status: string;
  Jurisdiction: string;
  UpdatedOn: string;
  Template: string;
  Flagged:boolean;
  DrugsInSystem:string[];
  Data: any;
};


