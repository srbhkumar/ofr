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

        private ICaseDal _caseDal;
        public ICaseDal CaseDal
        {
            get { return _caseDal ?? ( _caseDal = new CaseDal()); }
            set { _caseDal = value; }
        }
        PDMPController()
        {
            TelClient = new TelemetryClient();
        }

        [Route("{caseId}")]
        public async Task<HttpResponseMessage> GetPDMPData(string caseId)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("GetPDMPData"))
            {
                try
                {
                    var searchCase = CaseDal.GetCaseById(caseId, Request);
                    if (searchCase == null)
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Case does not exist");
                    var lookupDetails = new LookupRequest();

                    //Set the address
                    var address = new Address();
                    address.Street = searchCase.OCMEData.ContainsKey("RES_ADDR") ? searchCase.OCMEData["RES_ADDR"] : null;
                    address.City = searchCase.OCMEData.ContainsKey("RES_CITY") ? searchCase.OCMEData["RES_CITY"] : null;
                    address.ZipCode = searchCase.OCMEData.ContainsKey("RES_ZIP") ? searchCase.OCMEData["RES_ZIP"] : null;
                    address.State = searchCase.OCMEData.ContainsKey("RES_STATE") ? searchCase.OCMEData["RES_STATE"] : null;
                    lookupDetails.Address = new List<Address>() { address };

                    //Set the name
                    var name = new Name();
                    name.First = searchCase.OCMEData.ContainsKey("NAME_FIRST") ? searchCase.OCMEData["NAME_FIRST"] : null;
                    name.Last = searchCase.OCMEData.ContainsKey("NAME_LAST") ? searchCase.OCMEData["NAME_LAST"] : null;
                    name.Middle = searchCase.OCMEData.ContainsKey("NAME_MIDDLE") ? searchCase.OCMEData["NAME_MIDDLE"] : null;
                    lookupDetails.Name = new List<Name>() { name };

                    //Set the gender
                    var gender = new Gender();
                    gender.GenderValue = searchCase.OCMEData.ContainsKey("GENDER") ? searchCase.OCMEData["GENDER"][0] : ' ';
                    lookupDetails.Gender = new List<Gender>() { gender };

                    //Set the Date of Birth
                    var dob = new DOB();
                    dob.DateVal = searchCase.OCMEData.ContainsKey("DATE_OF_BIRTH") ? DateTime.Parse(searchCase.OCMEData["DATE_OF_BIRTH"]).ToString("yyyy-MM-dd") : null;
                    lookupDetails.DateOfBirth = new List<DOB> { dob };

                    var eid = await PDMPDal.GetEid(getUserName(), lookupDetails);
                    if(eid == null)
                        return Request.CreateResponse(HttpStatusCode.OK, "");
                    else
                        return Request.CreateResponse(HttpStatusCode.OK, await PDMPDal.GetPDMPData(getUserName() , eid));
                }
                catch (Exception ex)
                {
                    //return HandleExceptions(ex, operation, Request);
                    return Request.CreateResponse(HttpStatusCode.BadRequest, ex);
                }
            }
        }
    }
}
