using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Azure.Documents.Client;
using Microsoft.ApplicationInsights;
using Microsoft​.ApplicationInsights​.DataContracts;

namespace OFRFunctions
{
    public static class Dashboard
    {
        [FunctionName("Dashboard")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "dashboard")]HttpRequestMessage req, TraceWriter log)
        {
            using (var op = DAL.TC.StartOperation<RequestTelemetry>("Dashboard"))
            {
                log.Info("C# HTTP trigger function processed a request.");
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = req.RequestUri;

                var cases = DAL.Client.CreateDocumentQuery<Case>(
                    UriFactory.CreateDocumentCollectionUri("ofr-dev-db", "Cases"),
                    new FeedOptions { MaxItemCount = 2 }
                );

                log.Info("It Hit Here");
                // todo: filter to dashboard-fields only, to save transmit

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