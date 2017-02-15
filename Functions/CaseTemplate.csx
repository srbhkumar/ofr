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
}