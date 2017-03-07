#load "../DAL.csx"

using System.Net;
using System.Dynamic;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using System.Linq;


static string[] validStatii = new [] {
    "Available",
    "Assigned",
    "Dismissed",
    "Flagged",
    "Unflagged"
};

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, string newStatus, TraceWriter log)
{
    if (!validStatii.Contains(newStatus))
    {
        return req.CreateResponse(HttpStatusCode.BadRequest, new { Result = "Error", Message = $"Invalid status code '{newStatus}'" });
    }

    var client = DAL.CreateClient();

    await client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "SetCaseStatus"),
        caseId,
        newStatus
    );

    // response
    return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
}