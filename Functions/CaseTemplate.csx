#load "Case.csx"
using System.Collections.Generic;

/*public enum FieldType
{
    Text,
    Date,
    Time,
    Checkbox,
    Radio,
    Dropdown
}*/

public class CaseField
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Type { get; set; }
    public bool Required { get; set; }
    public List<string> Options { get; set; }
}

public class CaseTemplate
{
    public string id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Layout { get; set; }
    public List<CaseField> Fields { get; set; }

    public bool Validate(Case c)
    {
        // validate that any required fields are present

        return true;
    }

    public void Prune(Case c)
    {
        // eliminate fields that are not in the template
    }
}