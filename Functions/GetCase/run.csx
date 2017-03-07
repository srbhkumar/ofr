#r "Newtonsoft.Json"
#load "../Case.csx"
#load "../DAL.csx"

using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft​.ApplicationInsights​.DataContracts;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    using(var op = DAL.TC.StartOperation<RequestTelemetry>("GetCase"))
    {
        op.Telemetry.ResponseCode = "200";
        op.Telemetry.Url = req.RequestUri;
    
        var c = DAL.Client.CreateDocumentQuery<Case>(UriFactory.CreateDocumentCollectionUri("OFR", "Cases"))
            .Where(d => d.id == caseId)
            .AsEnumerable().FirstOrDefault();

        return req.CreateResponse(HttpStatusCode.OK, c);
    }
}