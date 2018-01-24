using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using OfrApi.Interfaces;
using OfrApi.Models;
using OfrApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/pdmp")]
    public class PDMPController : BaseController
    {
        private IPDMPDal _pdmpDal;
        public IPDMPDal PDMPDal
        {
            get { return _pdmpDal ?? (_pdmpDal = new PDMPDal()); }
            set { _pdmpDal = value; }
        }
        PDMPController()
        {
            TelClient = new TelemetryClient();
        }

        [Route("{mrn}")]
        public async Task<HttpResponseMessage> GetPDMPData(string mrn)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetPDMPData"))
            {
                try
                {
                    return Request.CreateResponse(HttpStatusCode.OK, await PDMPDal.GetPDMPData(getUserName(), mrn));
                }
                catch (Exception ex)
                {
                    return HandleExceptions(ex, operation, Request);
                }
            }
        }
    }
}
