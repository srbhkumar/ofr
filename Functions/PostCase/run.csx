#load "../Case.csx"
#load "../CaseTemplate.csx"
#load "../DAL.csx"

using System.Net;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft​.ApplicationInsights​.DataContracts;
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    using(var op = DAL.TC.StartOperation<RequestTelemetry>("PostCase"))
    {
        op.Telemetry.ResponseCode = "200";
        op.Telemetry.Url = req.RequestUri;
    
        // Get request body
        dynamic data = await req.Content.ReadAsAsync<object>();

        await DAL.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "MergeCase"),
            caseId,
            data
        );

        // response
        return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
    }
}