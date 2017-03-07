#load "../DAL.csx"

using System.Net;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using System.Linq;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft​.ApplicationInsights​.DataContracts;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    using(var op = DAL.TC.StartOperation<RequestTelemetry>("Submit"))
    {
        op.Telemetry.ResponseCode = "200";
        op.Telemetry.Url = req.RequestUri;

        // todo: validation
    
        await DAL.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "SubmitCase"),
            caseId
        );

        // todo: emails

        // response
        return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
    }
}