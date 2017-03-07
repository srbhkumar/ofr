#r "Newtonsoft.Json"
#load "../CaseTemplate.csx"
#load "../DAL.csx"

using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;


public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string templateId, TraceWriter log)
{
    using(var op = DAL.TC.StartOperation<RequestTelemetry>("GetTemplate"))
    {
        op.Telemetry.ResponseCode = "200";
        op.Telemetry.Url = req.RequestUri;
    
        var c = DAL.Client.CreateDocumentQuery<CaseTemplate>(UriFactory.CreateDocumentCollectionUri("OFR", "Templates"))
            .Where(d => d.id == templateId)
            .AsEnumerable().FirstOrDefault();

        return req.CreateResponse(HttpStatusCode.OK, c);
    }
}