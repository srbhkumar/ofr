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
    [RoutePrefix("api/pdmp/")]
    public class PDMPController : BaseController
    {
        //private IPDMPDal _pdmpDal;
        //public IPDMPDal PDMPDal
        //{
        //    get { return _pdmpDal ?? (_pdmpDal = new PDMPDal()); }
        //    set { _pdmpDal = value; }
        //}

        //[Route("{mrn}")]
        //public async Task<PDMPData> GetPDMPData(string mrn)
        //{
        //    return await _pdmpDal.GetPDMPData(getUserName(), mrn);
        //}
    }
}
