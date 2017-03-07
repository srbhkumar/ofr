#load "../DAL.csx"

using System.Net;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using System.Linq;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft​.ApplicationInsights​.DataContracts;

static string[] validStatii = new [] {
    "Available",
    "Assigned",
    "Dismissed",
    "Flagged",
    "Unflagged"
};

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, string newStatus, TraceWriter log)
{
    using(var op = DAL.TC.StartOperation<RequestTelemetry>("Status"))
    {
        op.Telemetry.ResponseCode = "200";
        op.Telemetry.Url = req.RequestUri;
    
        if (!validStatii.Contains(newStatus))
        {
            return req.CreateResponse(HttpStatusCode.BadRequest, new { Result = "Error", Message = $"Invalid status code '{newStatus}'" });
        }

        await DAL.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "SetCaseStatus"),
            caseId,
            newStatus
        );

        // response
        return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
    }
}