using System.Linq;
using System.Net;
using System.Net.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System.Threading.Tasks;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.Azure.Documents.Client;
using System;
using Microsoft.ApplicationInsights;

namespace OFRFunctions
{
    public static class dismissedCasesDashboard
    {
        [FunctionName("dismissedCasesDashboard")]

        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "dismissedcases/{page}")]HttpRequestMessage req, string page, TraceWriter log)
        {
            using (var op = DAL.TC.StartOperation<RequestTelemetry>("DismissedCasesDashboard"))
            {
                log.Info("C# HTTP trigger function processed a request.");
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = req.RequestUri;
                var pageParam = Int32.Parse(page);
                //string continuationToken;
                //log.Info(pageParam.toString());

                var feedOptions = new FeedOptions
                {
                    EnableCrossPartitionQuery = true,
                    MaxItemCount = -1,
                    EnableScanInQuery = true
                };



                var skipCount = (pageParam - 1) * 5;
                var takeCount = 5;

                var cases = DAL.Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri("ofr-dev-db", "Cases"),
                feedOptions)
                .Where(c => c.Status == "Dismissed")
                .Take(skipCount + takeCount)
                .ToArray()
                .Skip(skipCount);


                return req.CreateResponse(HttpStatusCode.OK, new
                {
                    identity = "Test User",
                    regions = new[] { "Baltimore City" },
                    roles = new[] { "Caseworker" },
                    cases
                });
            }
        }
    }
}