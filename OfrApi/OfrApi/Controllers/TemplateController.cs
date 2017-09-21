using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Azure.Documents.Client;
using OfrApi.Models;
using OfrApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Configuration;
using System.Web.Http;

namespace OfrApi.Controllers
{
    //Allows retreival and creation of new templates 
    [RoutePrefix("api/template")]
    public class TemplateController : ApiController
    {
        private TemplateDal TemplateDal;
        private TelemetryClient TelClient;
        public TemplateController()
        {
            TemplateDal = new TemplateDal();
            TelemetryConfiguration.Active.InstrumentationKey = WebConfigurationManager.AppSettings["InstrumentationKey"];
            TelClient = new TelemetryClient();
        }

        public TemplateController(TemplateDal dal, TelemetryClient telClient)
        {
            TemplateDal = dal;
            TelClient = telClient;
        }

        //api/case/3
        [Route("{id}")]
        public HttpResponseMessage Get(string id)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetTemplate"))
            {
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    operation.Telemetry.Url = Request.RequestUri;
                    operation.Telemetry.Success = true;
                    return Request.CreateResponse(HttpStatusCode.OK, TemplateDal.getTemplate(id, Request), Configuration.Formatters.JsonFormatter, "text/html");
                }
                catch (Exception ex)
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.InternalServerError.ToString();
                    var identifier = DateTime.Now.Ticks.ToString().Substring(8);
                    TelClient.TrackException(ex, new Dictionary<string, string> { { "id", identifier } });
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error ID: " + identifier);
                }
            }
        }
    }
}
