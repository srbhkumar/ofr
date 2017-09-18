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
        private TemplateDal TemplateDal;
 
        public TemplateController()
        {
            TemplateDal = new TemplateDal();
        }

        public TemplateController(TemplateDal dal)
        {
            TemplateDal = dal;
        }

        //api/case/3
        [Route("{id}")]
        public HttpResponseMessage Get(string id)
        {
            return Request.CreateResponse(HttpStatusCode.OK, TemplateDal.getTemplate(id, Request), Configuration.Formatters.JsonFormatter, "text/html");
        }
    }
}
