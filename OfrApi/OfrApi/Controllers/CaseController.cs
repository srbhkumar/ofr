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
    [Authorize]
    [RoutePrefix("api/case")]
    public class CaseController : ApiController
    {

        // GET api/case
        [Route("")]
        public HttpResponseMessage Get()
        {
            using (var op = Dal.TelClient.StartOperation<RequestTelemetry>("Dashboard"))
            {
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = Request.RequestUri;

                var cases = Dal.Client.CreateDocumentQuery<Case>(
                    UriFactory.CreateDocumentCollectionUri("cases", "cases"),
                    new FeedOptions { MaxItemCount = -1 }
                );

                //todo: filter to dashboard - fields only, to save transmit
                return Request.CreateResponse(HttpStatusCode.OK, cases.ToArray(), Configuration.Formatters.JsonFormatter, "text/html");
            }
        }

        // GET api/case/5
        [Route("{id}")]
        public HttpResponseMessage Get(string id)
        {
            using (var op = Dal.TelClient.StartOperation<RequestTelemetry>("GetCase"))
            {
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = Request.RequestUri;

                var c = Dal.Client.CreateDocumentQuery<Case>(UriFactory.CreateDocumentCollectionUri("cases", "cases"))
                    .Where(d => d.id == id)
                    .AsEnumerable().FirstOrDefault();
                
                return Request.CreateResponse(HttpStatusCode.OK, c, Configuration.Formatters.JsonFormatter, "text/html") ;
            }
        }

        // GET api/case/2/ping
        [Route("{id:int}/ping")]
        public string Ping(int id)
        {
            //using (var op = Dal.TelClient.StartOperation<RequestTelemetry>("Ping"))
            //{
            //        op.Telemetry.ResponseCode = "200";
            //        op.Telemetry.Url = req.RequestUri;

            //        var username = req.Headers.GetValues("Username").First();

            //        var response = await Dal.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "PingCase"),
            //            caseId,
            //            username
            //        );

            //        // response
            //        return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success", Data = response});
            //}
            return "routing works";
        }

        // POST api/case
        [Route("")]
        public string Post(object newCase)
        {
            //using (var op = DAL.TC.StartOperation<RequestTelemetry>("PostCase"))
            //{
            //    op.Telemetry.ResponseCode = "200";
            //    op.Telemetry.Url = req.RequestUri;

            //    // Get request body
            //    dynamic data = await req.Content.ReadAsAsync<object>();

            //    await DAL.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "MergeCase"),
            //        caseId,
            //        data
            //    );

            //    // response
            //    return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
            //}
            return null;
        }

        // GET api/case/1/submit
        [Route("{id:int}/submit")]
        public string Submit(int id)
        {
            //using (var op = DAL.TC.StartOperation<RequestTelemetry>("Submit"))
            //{
            //    op.Telemetry.ResponseCode = "200";
            //    op.Telemetry.Url = req.RequestUri;

            //    // todo: validation

            //    await DAL.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "SubmitCase"),
            //        caseId
            //    );

            //    // todo: emails

            //    // response
            //    return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
            //}
            return "Submit routing properly";
        }

        //Get api/case/page/1/open
        [HttpGet]
        [Route("page/{number:int}/open")]
        public string OpenPage(int number)
        {
            return "thing";
        }


    }
}
