using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using OfrApi.Models;
using OfrApi.Services;
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
        private CaseDal CaseDal;
        public CaseController()
        {
            CaseDal = new CaseDal();
        }

        public CaseController(CaseDal caseDal)
        {
            CaseDal = caseDal;
        }

        // GET api/case/5
        [Route("{id}")]
        public HttpResponseMessage Get(string id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, CaseDal.GetCaseById(id, Request), Configuration.Formatters.JsonFormatter, "text/html");
        }

        // GET api/case/2/ping
        [HttpGet]
        [Route("{id}/ping")]
        public string Ping(string id)
        {
            return "routing works";
        }

        // POST api/case
        [Route("{id}")]
        [HttpPost]
        public HttpResponseMessage Post(string id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, CaseDal.PostCaseById(id, Request), Configuration.Formatters.JsonFormatter, "text/html"); ;
        }

        // GET api/case/1/submit
        [Route("{id}/submit")]
        public HttpResponseMessage Submit(string id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, CaseDal.SubmitCaseById(id, Request), Configuration.Formatters.JsonFormatter, "text/html"); ;
        }


        //Get api/case/page/1/submitted
        [HttpGet]
        [Route("page/{number}/submitted")]
        public HttpResponseMessage GetSubmittedPage(int number)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { cases = CaseDal.GetSubmittedCasesByPage(number, Request) }, Configuration.Formatters.JsonFormatter, "text/html");
        }

        //Get api/case/page/1/dismissed
        [HttpGet]
        [Route("page/{number}/dismissed")]
        public HttpResponseMessage GetDismissedPage(int number)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { cases = CaseDal.GetDismissedCasesByPage(number, Request)}, Configuration.Formatters.JsonFormatter, "text/html");
        }

        //Get api/case/page/1/available
        [HttpGet]
        [Route("page/{number}/available")]
        public HttpResponseMessage GetAvailablePage(int number)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { cases = CaseDal.GetAvailableCasesByPage(number, Request) }, Configuration.Formatters.JsonFormatter, "text/html");
        }

        //Get api/case/page/1/open
        [HttpGet]
        [Route("page/{number}/open")]
        public HttpResponseMessage GetOpenPage(int number)
        {
            
            return Request.CreateResponse(HttpStatusCode.OK,  new {cases = CaseDal.GetOpenCasesByPage(number, Request) }, Configuration.Formatters.JsonFormatter, "text/html");
        }

        //Handles the uploading of OCME files
        //[HttpPost]
        //[Route("load/")]


    }
}
