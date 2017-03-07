#load "../Case.csx"
#load "../DAL.csx"

#r "Newtonsoft.Json"
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft​.ApplicationInsights​.DataContracts;
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    using(var op = DAL.TC.StartOperation<RequestTelemetry>("Dashboard"))
    {
        op.Telemetry.ResponseCode = "200";
        op.Telemetry.Url = req.RequestUri;
    
        var cases = DAL.Client.CreateDocumentQuery<Case>(
            UriFactory.CreateDocumentCollectionUri("OFR", "Cases"),
            new FeedOptions { MaxItemCount = -1}
        );
        
        // todo: filter to dashboard-fields only, to save transmit

        return req.CreateResponse(HttpStatusCode.OK, new {
            identity = "Test User",
            regions = new [] { "Baltimore City" },
            roles = new [] { "Caseworker" },
            cases
        });
    }
}