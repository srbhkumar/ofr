#r "Newtonsoft.Json"
#load "../Case.csx"
#load "../DAL.csx"

using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;


public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    var client = DAL.CreateClient();

    var c = client.CreateDocumentQuery<Case>(UriFactory.CreateDocumentCollectionUri("OFR", "Cases"))
        .Where(d => d.id == caseId)
        .AsEnumerable().FirstOrDefault();

    return req.CreateResponse(HttpStatusCode.OK, c);
}