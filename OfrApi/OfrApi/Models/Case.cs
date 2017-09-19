using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfrApi.Models
{
    public class Case
    {
        public string id { get; set; }
        public string OCME { get; set; }
        public string Status { get; set; }
        public string Jurisdiction { get; set; }
        public bool Flagged { get; set; }

        public DateTime UpdatedOn { get; set; }

        public string Template { get; set; }
        public dynamic Data { get; set; }

    }
}