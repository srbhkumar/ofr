#load "../Case.csx"

#r "Newtonsoft.Json"
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    var endpoint = "https://crisp-ofr.documents.azure.com:443/";
    var primkey = "EbhSXsV6wqaccGZUNkKACVxoE64Js3h2wfSavkfwBzpKMO0Lik9rNWzvrcgzgWQhyCX8qM25Qxct7SzUR6KIPw";

    var client = new DocumentClient(new Uri(endpoint), primkey);

    var cases = client.CreateDocumentQuery<Case>(
        UriFactory.CreateDocumentCollectionUri("OFR", "Cases"),
        new FeedOptions { MaxItemCount = -1}
    );
    
    // todo: filter to dashboard-fields only, to save transmit

    return req.CreateResponse(HttpStatusCode.OK, new {
        identity = "Test User",
        regions = new [] { "Baltimore City" },
        roles = new [] { "Caseworker" },
        cases
    });
}