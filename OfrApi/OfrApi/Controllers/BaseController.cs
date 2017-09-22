using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace OfrApi.Controllers
{
    public abstract class BaseController : ApiController
    {
        protected TelemetryClient TelClient { get; set; }
        protected HttpResponseMessage HandleExceptions(Exception ex, IOperationHolder<RequestTelemetry> operation, HttpRequestMessage request)
        {
            operation.Telemetry.ResponseCode = HttpStatusCode.InternalServerError.ToString();
            var identifier = DateTime.Now.Ticks.ToString().Substring(8);
            TelClient.TrackException(ex, new Dictionary<string, string> { { "id", identifier } });
            return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error ID: " + identifier);
        }
    }
}
