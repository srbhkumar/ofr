using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.Azure.Documents.Client;
using OfrApi.Models;
using OfrApi.Services;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace OfrApi.Controllers
{
    //Allows retreival and creation of new templates 
    [RoutePrefix("api/template")]
    public class TemplateController : ApiController
    {
        [Route("${id:int}")]
        public void Get(string id)
        {
            /*using (var op = Dal.TelClient.StartOperation<RequestTelemetry>("GetTemplate"))
            {
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = Request.RequestUri;

                var c = Dal.Client.CreateDocumentQuery<CaseTemplate>(UriFactory.CreateDocumentCollectionUri("ofr", "templates"))
                    .Where(d => d.id == id)
                    .AsEnumerable().FirstOrDefault();

                return Request.CreateResponse(HttpStatusCode.OK, c);
            }*/
        }
    }
}
