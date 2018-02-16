using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfrApi.Models
{
    public class LookupResult
    {
        public List<EidResult> Results { get; set; }
        public string Error { get; set; }
    }

    public class EidResult
    {
        public string EnterpriseId { get; set; }
        public string Score { get; set; }
        public string MemStat { get; set; }
        public string RecStat { get; set; }
    }
}