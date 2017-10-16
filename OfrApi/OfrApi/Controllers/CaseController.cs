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
    public class CaseController : BaseController
    {
        private ICaseDal _caseDal;
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
        public HttpResponseMessage Download(string startDateDeath, string endDateDeath, string startDateReview, string endDateReview, string type)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("DownloadCases"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                DateTime startDeath, endDeath, startReview, endReview;
                DateTime.TryParse(startDateDeath, out startDeath);
                DateTime.TryParse(endDateDeath, out endDeath);
                DateTime.TryParse(startDateReview, out startReview);
                DateTime.TryParse(endDateReview, out endReview);
                if (!((startDeath == DateTime.MinValue && endDeath == DateTime.MinValue) || (startReview == DateTime.MinValue && endReview == DateTime.MinValue)))
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Must specify at least one range of dates");


                if (endDeath == DateTime.MinValue)
                    endDeath = DateTime.MaxValue;

                if (endReview == DateTime.MinValue)
                    endReview = DateTime.MaxValue;
               
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    var cases = _caseDal.DownloadCases(startDeath, endDeath, startReview, endReview, Request);
                    
                    var returnFile = new StringBuilder("Status,UpdatedOn,");
                    if (cases.Count == 0)
                    {
                        return Request.CreateResponse(HttpStatusCode.NoContent, "No cases exist in the specified date range");
                    }

                    //Retrieve the longest OCME header
                    var longestOCMEHeader = cases.OrderByDescending(c => c.OCMEData.Count).First().OCMEData.Select(d => d.Key);
                    if (cases.Count > 0 && type == "OCME")
                    {
                        returnFile.AppendLine(string.Join(",", longestOCMEHeader));
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
                        var longestDataHeader = cases.OrderByDescending(c => c.Data.Count).First().Data.Select(d => d.Key);
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
                    return HandleExceptions(ex, operation, Request);
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
                    return HandleExceptions(ex, operation, Request);
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
                    return Request.CreateResponse(HttpStatusCode.OK, "Success");
                }
                catch (Exception ex)
                {
                    return HandleExceptions(ex, operation, Request);
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
                    _caseDal.UpdateStatusById(id, newStatus, Request);
                    return Request.CreateResponse(HttpStatusCode.OK, "Success");
                }
                catch (Exception ex)
                {
                    return HandleExceptions(ex, operation, Request);
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
                    return Request.CreateResponse(HttpStatusCode.OK, "Success");
                }
                catch (Exception ex)
                {
                    return HandleExceptions(ex, operation, Request);
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
                    return Request.CreateResponse(HttpStatusCode.OK, "Success", Configuration.Formatters.JsonFormatter, "application/json");
                }
                catch (Exception ex)
                {
                    return HandleExceptions(ex, operation, Request);
                }
            }
        }

        //Get api/case/page/1/submitted
        [HttpGet]
        [Route("page/{number}/submitted")]
        public HttpResponseMessage GetSubmittedPage(int number, int size = 5, bool flaggedOnly = false)
        {
            return GetPageByType(number, CaseStatus.Submitted, size, flaggedOnly,  Request);
        }

        //Get api/case/page/1/dismissed
        [HttpGet]
        [Route("page/{number}/dismissed")]
        public HttpResponseMessage GetDismissedPage(int number, int size = 5, bool flaggedOnly = false)
        {
            return GetPageByType(number, CaseStatus.Dismissed, size, flaggedOnly, Request);
        }

        //Get api/case/page/1/available
        [HttpGet]
        [Route("page/{number}/available")]
        public HttpResponseMessage GetAvailablePage(int number, int size = 5, bool flaggedOnly = false)
        {
            return GetPageByType(number, CaseStatus.Available,size,  flaggedOnly, Request);
        }

        //Get api/case/page/1/open
        [HttpGet]
        [Route("page/{number}/open")]
        public HttpResponseMessage GetOpenPage(int number, int size = 5, bool flaggedOnly = false)
        {
            return GetPageByType(number, CaseStatus.Assigned, size, flaggedOnly, Request);
        }

        private HttpResponseMessage GetPageByType(int number, CaseStatus status, int size, bool flaggedOnly, HttpRequestMessage request)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("Get" + status.ToString() + "CasePage"))
            {
                if (size < 1 || number < 1)
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid query parameter");
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();

                    var caseResponse = _caseDal.GetCasesByPage(number, status, size, flaggedOnly, request);
                    return Request.CreateResponse(HttpStatusCode.OK,
                        new
                        {
                            total = caseResponse.Item1,
                            cases = caseResponse.Item2.ToList(),
                            page = number
                        }, Configuration.Formatters.JsonFormatter, "application/json");
                }
                catch (Exception ex)
                {
                    return HandleExceptions(ex, operation, Request);
                }
            }
        }

    }
}
