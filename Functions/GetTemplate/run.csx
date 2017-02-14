#r "Newtonsoft.Json"
#load "../CaseTemplate.csx"

using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;


public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string templateId, TraceWriter log)
{
    var endpoint = "https://crisp-ofr.documents.azure.com:443/";
    var primkey = "EbhSXsV6wqaccGZUNkKACVxoE64Js3h2wfSavkfwBzpKMO0Lik9rNWzvrcgzgWQhyCX8qM25Qxct7SzUR6KIPw";

    var client = new DocumentClient(new Uri(endpoint), primkey);

    // todo: how slow is this? another way of getting a typed result back?
    var c = client.CreateDocumentQuery<CaseTemplate>(UriFactory.CreateDocumentCollectionUri("OFR", "Templates"))
        .Where(d => d.id == templateId)
        .AsEnumerable().FirstOrDefault();

    return req.CreateResponse(HttpStatusCode.OK, c);
}