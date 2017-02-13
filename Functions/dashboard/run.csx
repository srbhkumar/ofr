#r "Newtonsoft.Json"
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;

class Case
{
    public string id {get;set;}
    public string Status {get;set;}
    public string Jurisdiction {get;set;}
    public dynamic Data {get;set;}
}

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    var endpoint = "https://crisp-ofr.documents.azure.com:443/";
    var primkey = "EbhSXsV6wqaccGZUNkKACVxoE64Js3h2wfSavkfwBzpKMO0Lik9rNWzvrcgzgWQhyCX8qM25Qxct7SzUR6KIPw";

    var client = new DocumentClient(new Uri(endpoint), primkey);

    var cases = client.CreateDocumentQuery<Case>(
        UriFactory.CreateDocumentCollectionUri("OFR", "Cases"),
        new FeedOptions { MaxItemCount = -1}
    );

    return req.CreateResponse(HttpStatusCode.OK, new {
        identity = "Test User",
        regions = new [] { "Baltimore City" },
        roles = new [] { "Caseworker" },
        cases
    });
}