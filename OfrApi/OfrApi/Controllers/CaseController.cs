using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using OfrApi.Services;
using Swashbuckle.Swagger.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [RoutePrefix("api/case")]
    public class CaseController : ApiController
    {
        
        // GET api/case
        [Route("")]
        
        public HttpResponseMessage Get()
        {
            //using (var op = Dal.TelClient.StartOperation<RequestTelemetry>("Dashboard"))
            //{
                //op.Telemetry.ResponseCode = "200";
                //op.Telemetry.Url = Request.RequestUri;

                //var cases = Dal.Client.CreateDocumentQuery<Case>(
                //    UriFactory.CreateDocumentCollectionUri("OFR", "Cases"),
                //    new FeedOptions { MaxItemCount = -1 }
                //);

                // todo: filter to dashboard-fields only, to save transmit

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    identity = "Test User",
                    regions = new[] { "Baltimore City" },
                    roles = new[] { "Caseworker" },
                    id = 1
                }, Configuration.Formatters.JsonFormatter, "text/html");
            //}
        }

        // GET api/case/5
        [Route("{id:int}")]
        public HttpResponseMessage Get(int id)
        {
            //using (var op = Dal.TelClient.StartOperation<RequestTelemetry>("GetCase"))
            //{
            //    op.Telemetry.ResponseCode = "200";
            //    op.Telemetry.Url = req.RequestUri;

            //    var c = Dal.Client.CreateDocumentQuery<Case>(UriFactory.CreateDocumentCollectionUri("OFR", "Cases"))
            //        .Where(d => d.id == caseId)
            //        .AsEnumerable().FirstOrDefault();

            //    return req.CreateResponse(HttpStatusCode.OK, c);
            //}
            return Request.CreateResponse(HttpStatusCode.OK, "something", Configuration.Formatters.JsonFormatter, "text/html") ;
        }

        // GET api/case/2/ping
        [Authorize]
        [Route("{id:int}/ping")]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
        [System.Web.Http.HttpGet]
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
        [Authorize]
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

        // GET api/case/1/Submit
        [Route("{id:int}/submit")]
        [System.Web.Http.AcceptVerbs("GET", "POST")]
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


    }
}
