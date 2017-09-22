using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using OfrApi.Interfaces;
using OfrApi.Services;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/user")]
    public class UserController : BaseController
    {
        private IUserDal _userDal { get; }
        public UserController()
        {
            _userDal = new UserDal();
            TelemetryConfiguration.Active.InstrumentationKey = WebConfigurationManager.AppSettings["InstrumentationKey"];
            TelClient = new TelemetryClient();
        }

        public UserController(IUserDal userDal, TelemetryClient telClient)
        {
            _userDal = userDal;
            TelClient = telClient;
        }
        [Route("groups/{id}")]
        public async Task<HttpResponseMessage> Get(string id)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetCaseById"))
            {
                operation.Telemetry.Url = Request.RequestUri;
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    operation.Telemetry.Success = true;
                    var groups = await new UserDal().GetGroupsById(id);
                    groups = EncryptionService.Encrypt(groups);
                    return Request.CreateResponse(HttpStatusCode.OK, groups);
                }
                catch (Exception ex)
                {
                    return HandleExceptions(ex, operation, Request);
                }
            }
        }

    }
}
