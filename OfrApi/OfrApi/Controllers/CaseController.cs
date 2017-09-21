using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using OfrApi.Interfaces;
using OfrApi.Models;
using OfrApi.Services;
using OfrApi.Utilities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Configuration;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/case")]
    public class CaseController : ApiController
    {
        private ICaseDal _caseDal;
        private TelemetryClient TelClient;
        public CaseController()
        {
            _caseDal = new CaseDal();
            TelemetryConfiguration.Active.InstrumentationKey = WebConfigurationManager.AppSettings["InstrumentationKey"];
            TelClient = new TelemetryClient();
        }

        public CaseController(ICaseDal caseDal, TelemetryClient telClient)
        {
            _caseDal = caseDal;
            TelClient = telClient;
        }



        //Get api/case
        [HttpGet]
        [Route("download/cases")]
        public HttpResponseMessage Download(string startDate, string endDate, string type)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("DownloadCases"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                DateTime start;
                DateTime end;
                if (!DateTime.TryParse(startDate, out start))
                {
                    start = new DateTime(1970, 1, 1);
                }

                if (!DateTime.TryParse(endDate, out end))
                {
                    end = DateTime.Now;
                }
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    var cases = _caseDal.DownloadCases(start, end, Request);
                    
                    for (int i = cases.Count - 1; i >= 0; i--)
                    {
                        var dateOfDeath = DateTime.ParseExact(cases[i].Data["DateofDeath"].ToString().PadLeft(9, '0'), "yyyy-MM-dd", CultureInfo.InvariantCulture);
                        if (dateOfDeath < start ||
                            dateOfDeath > end)
                            cases.RemoveAt(i);
                    }
                    var returnFile = new StringBuilder("Status,UpdatedOn,");
                    if (cases.Count == 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.InternalServerError, "No cases exist in the specified date range");
                    }

                    //Retrieve the longest OCME header
                    var longestOCMEHeaderLength = cases.Max(c => c.OCMEData.Count);
                    var longestOCMEHeader = cases.Where(c => c.OCMEData.Count == longestOCMEHeaderLength).First().OCMEData.Select(d => d.Key);
                    if (cases.Count > 0 && type == "OCME")
                    {
                        returnFile.Append(string.Join(",", longestOCMEHeader));
                        returnFile.Append(Environment.NewLine);
                        foreach (Case c in cases)
                        {
                            //Adds empty strings where a case does not have a matching key in OCME data
                            longestOCMEHeader.Except(c.OCMEData.Keys)
                                                .ToList()
                                                .ForEach(f => c.OCMEData.Add(f, string.Empty));
                            returnFile.Append(c.Status + "," + c.UpdatedOn.ToString() + ",");
                            returnFile.Append(string.Join(",", c.OCMEData.Select(d => d.Value.Replace(",", ""))));
                            returnFile.Append(Environment.NewLine);
                        }
                    }
                    else if (cases.Count > 0 && type == "FULL")
                    {
                        //Retrieve the longest data header
                        var longestDataHeaderLength = cases.Max(c => c.Data.Count);
                        var longestDataHeader = cases.Where(c => c.Data.Count == longestDataHeaderLength).First().Data.Select(d => d.Key);
                        returnFile.Append(string.Join(",", longestDataHeader) + ",");
                        returnFile.Append(string.Join(",", longestOCMEHeader));

                        returnFile.Append(Environment.NewLine);
                        foreach (Case c in cases)
                        {
                            //Adds empty strings where a case does not have a matching key in Data
                            longestDataHeader.Except(c.Data.Keys)
                                                .ToList()
                                                .ForEach(f => c.Data.Add(f, string.Empty));
                            //Adds empty strings where a case does not have a matching key in OCME data
                            longestOCMEHeader.Except(c.OCMEData.Keys)
                                                .ToList()
                                                .ForEach(f => c.OCMEData.Add(f, string.Empty));

                            returnFile.Append(c.Status + "," + c.UpdatedOn.ToString() + ",");
                            returnFile.Append(string.Join(",", c.Data.Select(d => d.Value.Replace(",", ""))) + ",");
                            returnFile.Append(string.Join(",", c.OCMEData.Select(d => d.Value.Replace(",", ""))));
                            returnFile.Append(Environment.NewLine);
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, returnFile.ToString());
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

        // GET api/case/5
        [Route("{id}")]
        public HttpResponseMessage Get(string id)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetCaseById"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    operation.Telemetry.Success = true;
                    return Request.CreateResponse(HttpStatusCode.OK, _caseDal.GetCaseById(id, Request), Configuration.Formatters.JsonFormatter, "application/json");
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

        // GET/POST api/case/2/ping
        [HttpPost]
        [HttpGet]
        [Route("{id}/ping")]
        public HttpResponseMessage Ping(string id)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("PingCase"))
            {
                operation.Telemetry.ResponseCode = "200";
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    return Request.CreateResponse(HttpStatusCode.OK);
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

        [HttpPost]
        [Route("{id}/{status}/updatestatus")]
        public HttpResponseMessage UpdateStatus(string id, string status)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("UpdateCaseStatus"))
            {
                
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    CaseStatus newStatus;
                    Enum.TryParse(status, out newStatus);
                    return Request.CreateResponse(HttpStatusCode.OK);
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

        [HttpPost]
        [Route("{id}/submit")]
        public HttpResponseMessage Submit(string id)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("SubmitCase"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    _caseDal.SubmitCase(id, Request);
                    return Request.CreateResponse(HttpStatusCode.OK);
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

        // POST api/case
        [Route("{id}")]
        [HttpPost]
        public HttpResponseMessage Post(string id)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("PostCase"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    _caseDal.PostCaseById(id, Request);
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    return Request.CreateResponse(HttpStatusCode.OK);
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

        //Get api/case/page/1/submitted
        [HttpGet]
        [Route("page/{number}/submitted")]
        public HttpResponseMessage GetSubmittedPage(int number)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetSubmittedCasePage"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    return Request.CreateResponse(HttpStatusCode.OK, new { cases = _caseDal.GetCasesByPage(number, CaseStatus.Submitted, Request) }, Configuration.Formatters.JsonFormatter, "application/json");
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

        //Get api/case/page/1/dismissed
        [HttpGet]
        [Route("page/{number}/dismissed")]
        public HttpResponseMessage GetDismissedPage(int number)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetDismissedCasePage"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    return Request.CreateResponse(HttpStatusCode.OK, new { cases = _caseDal.GetCasesByPage(number, CaseStatus.Dismissed, Request) }, Configuration.Formatters.JsonFormatter, "application/json");
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

        //Get api/case/page/1/available
        [HttpGet]
        [Route("page/{number}/available")]
        public HttpResponseMessage GetAvailablePage(int number)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetAvailableCasePage"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    return Request.CreateResponse(HttpStatusCode.OK, new { cases = _caseDal.GetCasesByPage(number, CaseStatus.Available, Request) }, Configuration.Formatters.JsonFormatter, "application/json");
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

        //Get api/case/page/1/open
        [HttpGet]
        [Route("page/{number}/open")]
        public HttpResponseMessage GetOpenPage(int number)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetOpenCasePage"))
            {
                operation.Telemetry.ResponseCode = "200";
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new {cases = _caseDal.GetCasesByPage(number, CaseStatus.Assigned, Request) }, Configuration.Formatters.JsonFormatter, "application/json");
                }
                catch (Exception ex)
                {
                    TelClient.TrackException(ex);
                    return Request.CreateResponse(HttpStatusCode.InternalServerError);
                }
            }
        }
    }
}
