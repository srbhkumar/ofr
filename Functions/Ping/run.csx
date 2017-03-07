#load "../Case.csx"
#load "../DAL.csx"

using System.Net;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    using(var op = DAL.TC.StartOperation<RequestTelemetry>("Ping"))
    {
        op.Telemetry.ResponseCode = "200";
        op.Telemetry.Url = req.RequestUri;
    
        var username = req.Headers.GetValues("Username").First();

        var response = await DAL.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "PingCase"),
            caseId,
            username
        );

        // response
        return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success", Data = response });
    }
}