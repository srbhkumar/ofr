#load "../Case.csx"
#load "../CaseTemplate.csx"

using System.Net;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    var endpoint = "https://crisp-ofr.documents.azure.com:443/";
    var primkey = "EbhSXsV6wqaccGZUNkKACVxoE64Js3h2wfSavkfwBzpKMO0Lik9rNWzvrcgzgWQhyCX8qM25Qxct7SzUR6KIPw";

    var client = new DocumentClient(new Uri(endpoint), primkey);

    await client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "MergeCase"),
        caseId,
        data
    );

    // response
    return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
}