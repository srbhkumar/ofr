using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using OfrApi.Interfaces;
using OfrApi.Models;
using OfrApi.Services;
using OfrApi.Utilities;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/case")]
    public class CaseController : ApiController
    {
        private ICaseDal _caseDal;
        public CaseController()
        {
            _caseDal = new CaseDal();
        }

        public CaseController(ICaseDal caseDal)
        {
            _caseDal = caseDal;
        }

        // GET api/case/5
        [Route("{id}")]
        public HttpResponseMessage Get(string id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _caseDal.GetCaseById(id, Request), Configuration.Formatters.JsonFormatter, "application/json");
        }

        // GET/POST api/case/2/ping
        [HttpPost]
        [HttpGet]
        [Route("{id}/ping")]
        public string Ping(string id)
        {
            return "routing works";
        }

        [HttpPost]
        [Route("{id}/{status}/updatestatus")]
        public HttpResponseMessage UpdateStatus(string id, string status)
        {
            CaseStatus newStatus;
            Enum.TryParse(status, out newStatus);
            return Request.CreateResponse(HttpStatusCode.OK, _caseDal.UpdateStatusById(id, newStatus, Request), Configuration.Formatters.JsonFormatter, "application/json");
        }

        // POST api/case
        [Route("{id}")]
        [HttpPost]
        public HttpResponseMessage Post(string id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, _caseDal.PostCaseById(id, Request), Configuration.Formatters.JsonFormatter, "application/json"); ;
        }

        //Get api/case/page/1/submitted
        [HttpGet]
        [Route("page/{number:int}/submitted")]
        public HttpResponseMessage GetSubmittedPage(int number)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { cases = _caseDal.GetCasesByPage(number, CaseStatus.Submitted, Request) }, Configuration.Formatters.JsonFormatter, "application/json");
        }

        //Get api/case/page/1/dismissed
        [HttpGet]
        [Route("page/{number}/dismissed")]
        public HttpResponseMessage GetDismissedPage(int number)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { cases = _caseDal.GetCasesByPage(number, CaseStatus.Dismissed, Request) }, Configuration.Formatters.JsonFormatter, "application/json");
        }

        //Get api/case/page/1/available
        [HttpGet]
        [Route("page/{number}/available")]
        public HttpResponseMessage GetAvailablePage(int number)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { cases = _caseDal.GetCasesByPage(number, CaseStatus.Available, Request) }, Configuration.Formatters.JsonFormatter, "application/json");
        }

        //Get api/case/page/1/open
        [HttpGet]
        [Route("page/{number}/open")]
        public HttpResponseMessage GetOpenPage(int number)
        {
            
            return Request.CreateResponse(HttpStatusCode.OK, new {cases = _caseDal.GetCasesByPage(number, CaseStatus.Assigned, Request) }, Configuration.Formatters.JsonFormatter, "application/json");
        }


    }
}
