#load "../DAL.csx"

using System.Net;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using System.Linq;


public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    var client = DAL.CreateClient();

    // todo: validation
    
    await client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "SubmitCase"),
        caseId,
        newStatus
    );

    // todo: emails

    // response
    return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
}