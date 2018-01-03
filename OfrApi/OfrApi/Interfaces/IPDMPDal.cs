using OfrApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace OfrApi.Interfaces
{
    public interface IPDMPDal
    {
        Task<PDMPData> GetPDMPData(string username, string MRN);
    }
}