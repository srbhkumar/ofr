#load "../Case.csx"

using System;
using System.IO;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;

// todo: support line breaks in quoted values
#region CSV Stuff
static IEnumerable<string> CsvSplit(string input)
{
    int i = 0;
    while (i < input.Length)
    {
        if (input[i] == ' ')
        {
            ++i;
        }
        else if (input[i] == '"')
        {
            int next_quote = input.IndexOf('"', i + 1);
            while (next_quote + 1 < input.Length && input[next_quote + 1] == '"')
            {
                next_quote = input.IndexOf('"', next_quote + 2);
            }
            yield return input.Substring(i + 1, next_quote - i - 1);
            i = input.IndexOf(',', next_quote + 1);
            if (i == -1) yield break;
            ++i;
        }
        else
        {
            int next_comma = input.IndexOf(',', i);
            if (next_comma == -1) next_comma = input.Length;
            yield return input.Substring(i, next_comma - i);
            i = next_comma + 1;
        }
    }
}
#endregion

public static async void Run(Stream myBlob, string name, TraceWriter log)
{
    List<Case> cases = new List<Case>();
    using(var reader = new StreamReader(myBlob))
    {
        var line = reader.ReadLine();
        string[] Headers = CsvSplit(line).ToArray();

        while((line = reader.ReadLine()) != null)
        {
            Case c = new Case { Status = "New" };
            var di = (c.Data = new ExpandoObject()) as IDictionary<String,Object>;
            var values = CsvSplit(line).ToArray();
            for(int i = 0; i < values.Length; ++i)
            {
                switch(Headers[i])
                {
                    case "Jurisdiction":
                        c.Jurisdiction = values[i];
                        break;
                    default:
                        di[Headers[i]] = values[i];
                        break;
                }
            }
            cases.Add(c);
        }
    }
    // todo: better parallelization
    
    var endpoint = "https://crisp-ofr.documents.azure.com:443/";
    var primkey = "EbhSXsV6wqaccGZUNkKACVxoE64Js3h2wfSavkfwBzpKMO0Lik9rNWzvrcgzgWQhyCX8qM25Qxct7SzUR6KIPw";

    var client = new DocumentClient(new Uri(endpoint), primkey);

    foreach(var task in cases.Select(c => client.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri("OFR", "Cases"), c)).ToList())
    {
        await task;
    }
}