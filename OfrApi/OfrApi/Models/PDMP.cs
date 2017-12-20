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
        public int DaysSupply { get; set; }
        public PDMPPrescriber PrescribingProvider { get; set; }
        public int QuantityDispensed { get; set; }
        public string PharmacyName { get; set; }
        public string PaymentMethod { get; set; }
    }

    

    public class PDMPPrescriber
    {
        public Name Name { get; set; }
    }

    public class Name
    {
        public string First { get; set; }
        public string Last { get; set; }
    }
}