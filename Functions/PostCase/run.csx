#load "../Case.csx"
#load "../CaseTemplate.csx"
#load "../DAL.csx"

using System.Net;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    var client = DAL.CreateClient();

    await client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "MergeCase"),
        caseId,
        data
    );

    // response
    return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
}