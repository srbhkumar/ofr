using System.Net;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft?.ApplicationInsights?.DataContracts;
using Microsoft.Azure.Documents.Linq;
using System.Net.Http;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, Microsoft.Azure.WebJobs.Host.TraceWriter log, string CaseStatus)
{
    using (var op = DAL.TC.StartOperation<RequestTelemetry>("CaseCount"))
    {
        log.Info("C# HTTP trigger function processed a request.");
        op.Telemetry.ResponseCode = "200";
        //string continuationToken;
        //log.Info(pageParam.toString());

        var feedOptions = new FeedOptions
        {
            EnableCrossPartitionQuery = true,
            MaxItemCount = -1,
            EnableScanInQuery = true
        };



        int casecount = DAL.Client.CreateDocumentQuery(
        UriFactory.CreateDocumentCollectionUri("ofr-dev-db", "Cases"),
        feedOptions)
        .Where(c => c.Status == "Available");

        return req.CreateResponse(HttpStatusCode.OK, new
        {
            identity = "Test User",
            regions = new[] { "Baltimore City" },
            roles = new[] { "Caseworker" },
            casecount
        });
    }
}
