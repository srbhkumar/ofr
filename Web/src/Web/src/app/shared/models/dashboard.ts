export class Dashboard
{
    identity:string;
    regions:string[];
    roles:string[];
    cases:Case[];
}

class Case
{
  id: string;
  OCME: string;
  Status: string;
  Jurisdiction: string;
  UpdatedOn: string;
  Template: string;
  Data: any;
};