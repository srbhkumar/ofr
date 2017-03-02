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
    var client = DAL.CreateClient();

    // todo: how slow is this? another way of getting a typed result back?
    var c = client.CreateDocumentQuery<CaseTemplate>(UriFactory.CreateDocumentCollectionUri("OFR", "Templates"))
        .Where(d => d.id == templateId)
        .AsEnumerable().FirstOrDefault();

    return req.CreateResponse(HttpStatusCode.OK, c);
}