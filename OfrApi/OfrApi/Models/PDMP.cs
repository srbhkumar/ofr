using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfrApi.Models
{
    public class PDMPData
    {
        public string Notice { get; set; }
        public bool IsRegistered { get; set; }
        public IList<PDMP> Results { get; set; } = new List<PDMP>();
    }
    public class PDMP
    {
        public string Label { get; set; }
        public DateTime DateWritten { get; set; }
        public DateTime DateFilled { get; set; }
        public string DaysSupply { get; set; }
        public PDMPPrescriber PrescribingProvider { get; set; }
        public string QuantityDispensed { get; set; }
        public string PharmacyName { get; set; }
        public string PaymentMethod { get; set; }
    }

    

    public class PDMPPrescriber
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

}